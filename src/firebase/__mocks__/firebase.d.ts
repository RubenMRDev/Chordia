export declare const auth: {
    currentUser: {
        uid: string;
    };
};
export declare const mockStorageRef: {
    fullPath: string;
};
export declare const storage: {
    ref: jest.Mock<{
        fullPath: string;
    }, [], any>;
};
export declare const mockDocRef: {
    id: string;
};
export declare const mockCollectionRef: {
    id: string;
};
export declare const db: {
    collection: jest.Mock<{
        id: string;
    }, [], any>;
    doc: jest.Mock<{
        id: string;
    }, [], any>;
};
export declare const mockFirestore: {
    doc: jest.Mock<{
        id: string;
    }, [], any>;
    getDoc: jest.Mock<Promise<{
        exists: jest.Mock<boolean, [], any>;
        data: jest.Mock<null, [], any>;
        get: jest.Mock<any, any, any>;
        id: string;
    }>, [], any>;
    setDoc: jest.Mock<Promise<void>, [], any>;
    addDoc: jest.Mock<Promise<{
        id: string;
    }>, [], any>;
};
declare const _default: {
    auth: {
        currentUser: {
            uid: string;
        };
    };
    storage: {
        ref: jest.Mock<{
            fullPath: string;
        }, [], any>;
    };
    db: {
        collection: jest.Mock<{
            id: string;
        }, [], any>;
        doc: jest.Mock<{
            id: string;
        }, [], any>;
    };
    mockFirestore: {
        doc: jest.Mock<{
            id: string;
        }, [], any>;
        getDoc: jest.Mock<Promise<{
            exists: jest.Mock<boolean, [], any>;
            data: jest.Mock<null, [], any>;
            get: jest.Mock<any, any, any>;
            id: string;
        }>, [], any>;
        setDoc: jest.Mock<Promise<void>, [], any>;
        addDoc: jest.Mock<Promise<{
            id: string;
        }>, [], any>;
    };
};
export default _default;
