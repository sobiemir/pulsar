
interface IEntity
{
	name: string;
	size: number;
	modify: string;
	access: string;
	type: string;
	mime: string;
}

interface IFolder
{
	name: string;
	modify: string;
	access: string;
	children: IFolder[];
	rolled: boolean;
	checked: boolean;
}
