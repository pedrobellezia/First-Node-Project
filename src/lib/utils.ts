import { PDFParse } from "pdf-parse";
import axios from "axios";

type CertidaoResult = {
  certidao: boolean | null;
  validade: string | null;
  detail?: string;
};

class Utils {
  static sanitize_text(text: String) {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase()
      .replace(/\bhttps?\S+/g, "")
      .replace(/\b\d{6,}\b/g, "")
      .replace(
        /\b(secretaria|fazenda|planejamento|estado|municipal|federal|tribunal|justica|poder|ministerio|procuradoria|portaria|decreto|lei|instrucao|normativa|art|arts|ns)\b/g,
        "",
      )
      .replace(/\s+/g, " ")
      .trim();
  }

  static async get_validade(
    filename: string,
    cndtype: "fgts" | "trabalhista" | "municipal" | "estadual",
  ): Promise<CertidaoResult> {
    if (!["fgts", "trabalhista", "municipal", "estadual"].includes(cndtype)) {
      return {
        certidao: null,
        validade: null,
        detail: "Tipo de certidão não suportado",
      };
    }

    const url = `${process.env.CND_API_URL!}/pdf/${filename}`;

    let text: string;

    try {
      const parser = new PDFParse({ url });
      text = (await parser.getText()).text;
    } catch (error) {
      console.error("Erro ao ler o PDF:", error);

      return {
        certidao: null,
        validade: null,
        detail: "Erro técnico ao ler o PDF",
      };
    }

    if (!text || !text.trim()) {
      return {
        certidao: null,
        validade: null,
        detail: "Texto da certidão vazio ou ilegível",
      };
    }

    let sanitized: string;

    try {
      sanitized = this.sanitize_text(text);
    } catch {
      return {
        certidao: null,
        validade: null,
        detail: "Erro ao sanitizar o texto da certidão",
      };
    }

    if (!sanitized || sanitized.length < 20) {
      return {
        certidao: null,
        validade: null,
        detail: "Texto insuficiente para análise da certidão",
      };
    }

    let response;
    try {
      response = await axios.post(
        `${process.env.N8N_WEBHOOK_URL}/extract_info`,
        { text: sanitized },
        { timeout: 30_000 },
      );
    } catch (error) {
      console.error("Erro ao chamar o serviço de análise (n8n):", error);
      return {
        certidao: null,
        validade: null,
        detail: "Erro ao chamar o serviço de análise (n8n)",
      };
    }

    const data = response.data;

    if (!data || data.success === false) {
      return {
        certidao: null,
        validade: null,
        detail: data?.detail ?? "Falha no workflow de análise",
      };
    }

    return {
      certidao: typeof data.certidao === "boolean" ? data.certidao : null,
      validade: typeof data.validade === "string" ? data.validade : null,
      ...(data.certidao === null && {
        detail: "Não foi possível determinar a situação da certidão",
      }),
    };
  }
}

export default Utils;
