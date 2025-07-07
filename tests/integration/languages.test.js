const request = require("supertest");
const { Language } = require("../../models/language");
let server;

const dataLanguage = require("../data/languages.json");

const cleanDatabase = false;

describe("/api/languages", () => {
  beforeEach(async () => {
    server = require("../../index");

    if (cleanDatabase) {
      await Language.deleteMany({});
    }
  });

  afterEach(() => {
    server.close();
  });

  describe("GET /", () => {
    it("should return all languages", async () => {
      // Language.collection.insertMany(dataLanguage);
      const res = await request(server).get("/api/languages");
      expect(res.status).toBe(200);
    });
  });

  describe("POST /", () => {
    for (const languageItem of dataLanguage) {
      const exec = async () => {
        console.log("languageItem");
        return await request(server).post("/api/languages").send(languageItem);
      };

      it("should include 1 language", async () => {
        const res = await exec();
        expect(res.status).toBe(200);
      });
    }
  });
});
