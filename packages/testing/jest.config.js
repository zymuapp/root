module.exports = {
	preset: "ts-jest",
	testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	testTimeout: 30000,
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	testEnvironment: "node",
};
