export declare const mockDocRef: {
    id: string;
};
export declare const mockCollectionRef: {
    doc: jest.Mock<{
        id: string;
    }, [], any>;
};
export declare const mockStorageRef: {
    fullPath: string;
};
export declare const mockDb: {
    collection: jest.Mock<{
        doc: jest.Mock<{
            id: string;
        }, [], any>;
    }, [], any>;
    doc: jest.Mock<{
        id: string;
    }, [], any>;
};
export declare const mockStorage: {
    ref: jest.Mock<{
        fullPath: string;
    }, [], any>;
};
export declare const mockAuth: {
    currentUser: {
        uid: string;
    };
};
declare const _default: {
    db: {
        collection: jest.Mock<{
            doc: jest.Mock<{
                id: string;
            }, [], any>;
        }, [], any>;
        doc: jest.Mock<{
            id: string;
        }, [], any>;
    };
    storage: {
        ref: jest.Mock<{
            fullPath: string;
        }, [], any>;
    };
    auth: {
        currentUser: {
            uid: string;
        };
    };
};
export default _default;
