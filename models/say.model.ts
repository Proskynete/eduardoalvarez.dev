type VariantType = 'primary' | 'secondary';

export interface SayInterface {
	title: string;
	content: string;
	anchor?: string;
	variant?: VariantType;
}
