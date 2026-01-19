import { PDFParse } from "pdf-parse";

class Utils {
  static async get_validade(filename: string) {
    const url = `${process.env.CND_API_URL!}/cnd/${filename}`;
    const parser = new PDFParse({ url: url });
    const text = (await parser.getText()).text;

    const dates = [...text.matchAll(/\b\d{2}\/\d{2}\/\d{4}\b/g)].map(
      (m) => m[0]
    );

    const latest = dates
      .map((d) => {
        const [day, month, year] = d.split("/");
        return { raw: d, date: new Date(+year, +month - 1, +day) };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];

    return latest?.date.toISOString() || null;
  }
}

export default Utils;
