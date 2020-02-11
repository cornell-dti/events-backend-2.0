export type ExpectationRep = {
    description: string;
    expectVal: string;
    actualVal: string;
    operator: string;
    comparisonName: string;
    passed: boolean;
}

export type TestResult = {
    expectations: Array<ExpectationRep>,
    testClass: any,
    testFuncName: string,
    testClassName: string,
    passed: boolean,
    hasRun: boolean,
    cInd: number,
    tInd: number
}