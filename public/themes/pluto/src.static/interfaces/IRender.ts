
interface IRenderTreeExtra<TYPE>
{
	owner?: RenderArrayTree<TYPE>;
	child?: RenderArrayTree<TYPE>;
}

interface IRenderArrayOptions
{
	single?: boolean;
	template?: string | doT.RenderFunction;
	place?: HTMLElement;
	callObject?: any;
}

interface IRenderArrayTreeOptions
{
	treeSelector?: string;
	template?: string | doT.RenderFunction;
	place?: HTMLElement;
	childIndex?: string;
	callObject?: any;
}
