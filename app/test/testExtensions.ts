import * as testRunner from './runTests';

type Expect = {
  toBe: toBe;
  is: is;
  description: string;
}

type Describe = {
  expect: Function;
}

export type Expectation = {
  description: string;
  expectVal: any;
  actualVal: any;
  operator: any;
  functionName: string;
  passed: boolean;
}

export function describe(testDescription: string) {
  let x = function expect(val: any): Expect {
    return { toBe: new toBe(testDescription, val), is: new is(testDescription, val) } as Expect;
  }
  return { expect: x };
}

class is {

  private expectVal: any;
  private opInstance: is;
  private desc: string;
  public name:string;

  public constructor(desc: string, exp: any) {
    this.desc = desc;
    this.expectVal = exp;
    this.opInstance = this;
    this.name = 'is';
  }

  public null() {
    let opInstance = this;
    let triggerResponse = {
      expectVal: this.expectVal,
      actualVal: undefined,
      operator: this.opInstance,
      functionName: "null",
      passed: (this.expectVal == null),
      description: this.desc
    };
    testRunner.triggerReturn(triggerResponse);
  }

  public undefined() {
    let opInstance = this;
    let triggerResponse = {
      expectVal: this.expectVal,
      actualVal: undefined,
      operator: this.opInstance,
      functionName: "undefined",
      passed: (this.expectVal == undefined),
      description: this.desc
    };
    testRunner.triggerReturn(triggerResponse);
  }

  public nullOrUndefined() {
    let opInstance = this;
    let triggerResponse = {
      expectVal: this.expectVal,
      actualVal: undefined,
      operator: this.opInstance,
      functionName: "nullOrUndefined",
      passed: (this.expectVal == undefined || this.expectVal == null),
      description: this.desc
    };
    testRunner.triggerReturn(triggerResponse);
  }

  public defined() {
    let opInstance = this;
    let triggerResponse = {
      expectVal: this.expectVal,
      actualVal: undefined,
      operator: this.opInstance,
      functionName: "defined",
      passed: (this.expectVal != undefined),
      description: this.desc
    };
    testRunner.triggerReturn(triggerResponse);
  }

}

class toBe {

  private expectVal: any;
  private opInstance: toBe;
  private desc: string;
  public name: string;

  public constructor(desc: string, exp: any) {
    this.desc = desc;
    this.expectVal = exp;
    this.opInstance = this;
    this.name = 'toBe';
  }

  public equalTo(val: any) {
    let opInstance = this;
    let triggerFail = {
      expectVal: this.expectVal,
      actualVal: val,
      operator: this.opInstance,
      functionName: "equalTo",
      passed: (val == this.expectVal),
      description: this.desc
    };
    testRunner.triggerReturn(triggerFail);
  }

  public greaterThan(val: any) {
    let triggerFail = {
      expectVal: this.expectVal,
      actualVal: val,
      operator: this.opInstance,
      functionName: "greaterThan",
      passed: (this.expectVal > val),
      description: this.desc
    };
    testRunner.triggerReturn(triggerFail);
  }

  public lessThan(val: any) {
    let triggerFail = {
      expectVal: this.expectVal,
      actualVal: val,
      operator: this.opInstance,
      functionName: "lessThan",
      passed: (this.expectVal < val),
      description: this.desc
    };
    testRunner.triggerReturn(triggerFail);
  }

}