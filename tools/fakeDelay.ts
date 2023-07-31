const fakeDelay = (ms: number) => new Promise((f) => setTimeout(f, ms));

export default fakeDelay;
