const request = require("supertest");
const { Word } = require("../../models/word");
const { Language } = require("../../models/language");
let server;

const dataWords = require("../data/words.json");

const cleanDatabase = false;

describe("/api/words", () => {
  beforeEach(async () => {
    server = require("../../index");

    if (cleanDatabase) {
      await Word.deleteMany({});
    }
  });

  afterEach(() => {
    server.close();
  });

  describe("GET /", () => {
    it("should return all words", async () => {
      const res = await request(server).get("/api/words");
      expect(res.status).toBe(200);
    });
  });
});
