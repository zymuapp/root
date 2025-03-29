import { zymu } from "../src";

const API_URL = "https://api.zymu.dev";

describe("http", () => {
  let app: zymu;

  beforeEach(() => {
    app = new zymu({
      baseURL: API_URL,
    });
  });

  describe("http client url formation", () => {
    it("should correctly forms urls with multiple parameters", () => {
      expect(
        app.client.url("/path/to/:resource", {
          resource: "my-resource",
          limit: 20,
          skip: 20,
        }),
      ).toBe(`${API_URL}/path/to/my-resource?limit=20&skip=20`);

      expect(
        app.client.url("/path/to/:resource", {
          resource: "my-resource",
          limit: 20,
        }),
      ).toBe(`${API_URL}/path/to/my-resource?limit=20`);

      expect(
        app.client.url("/path/to/:resource/:param", {
          resource: "my-resource",
          param: "param2",
          limit: 20,
        }),
      ).toBe(`${API_URL}/path/to/my-resource/param2?limit=20`);
    });
  });

  describe("http client requests", () => {
    it("can make a request", async () => {
      //await expect(zymu.client.get("/health")).resolves.not.toThrow();
    });
  });
});
