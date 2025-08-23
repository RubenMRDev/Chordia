export declare const Sampler: jest.Mock<any, any, any>;
export declare const Volume: jest.Mock<any, any, any>;
export declare const Synth: jest.Mock<any, any, any>;
export declare const Time: jest.Mock<{
    toMilliseconds: () => 100;
}, [], any>;
export declare const loaded: jest.Mock<Promise<void>, [], any>;
export declare const context: {
    resume: jest.Mock<any, any, any>;
};
