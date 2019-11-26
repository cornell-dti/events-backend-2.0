import * as testRunner from './runTests';

type Expect = {
  toBe: toBe;
  is: is;
}

export type Expectation = {
  expectVal: any;
  actualVal: any;
  operator: any;
  functionName: string;
  passed: boolean;
}

export function expect(val: any): Expect {
  return { toBe: new toBe(val), is: new is(val) } as Expect;
}

class is {

  private expectVal: any;
  private opInstance: is;

  public constructor(exp: any) {
    this.expectVal = exp;
    this.opInstance = this;
  }

  public null() {
    let opInstance = this;
    let triggerResponse = {
      expectVal: this.expectVal,
      actualVal: undefined,
      operator: this.opInstance,
      functionName: "null",
      passed: this.expectVal == null
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
      passed: this.expectVal == undefined
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
      passed: this.expectVal == undefined || this.expectVal == null
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
      passed: this.expectVal != undefined
    };
    testRunner.triggerReturn(triggerResponse);
  }

}

class toBe {

  private expectVal: any;
  private opInstance: toBe;

  public constructor(exp: any) {
    this.expectVal = exp;
    this.opInstance = this;
  }

  public equalTo(val: any) {
    let opInstance = this;
    let triggerFail = {
      expectVal: this.expectVal,
      actualVal: val,
      operator: this.opInstance,
      functionName: "equalTo",
      passed: val == this.expectVal
    };
    testRunner.triggerReturn(triggerFail);
  }

  public greaterThan(val: any) {
    let triggerFail = {
      expectVal: this.expectVal,
      actualVal: val,
      operator: this.opInstance,
      functionName: "greaterThan",
      passed: val > this.expectVal
    };
    testRunner.triggerReturn(triggerFail);
  }

  public lessThan(val: any) {
    let triggerFail = {
      expectVal: this.expectVal,
      actualVal: val,
      operator: this.opInstance,
      functionName: "lessThan",
      passed: val < this.expectVal
    };
    testRunner.triggerReturn(triggerFail);
  }

}