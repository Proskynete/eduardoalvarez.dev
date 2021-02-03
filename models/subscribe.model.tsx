export type StatusCodeErrorAllowed = 419 | 420 | 500;
export type StatusCodeSuccessAllowed = 200 | 201;

export interface ErrorResponseInterface {
	code: StatusCodeErrorAllowed;
	error: string;
	message?: string;
}

export interface SuccessResponseInterface {
	code: StatusCodeSuccessAllowed;
	message: string;
}

export interface InputsInterface {
	name: string;
	email: string;
}

export interface TargetElementInterface {
	target: HTMLInputElement;
}
