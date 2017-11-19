
interface IObservableValue<TYPE>
{
	element: HTMLElement;
	value: TYPE;
	needUpdate: boolean;
	wasUpdated: boolean;
	extra: any;
}

interface IObservableFunction<TYPE>
{
	name: string;
	func: TObservableArrayFunc<TYPE>;
}

type TObservableArrayFunc<TYPE> = (obs: ObservableArray<TYPE>) => void;
