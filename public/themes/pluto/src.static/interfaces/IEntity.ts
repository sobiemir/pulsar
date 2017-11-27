
interface IEntity
{
	name: string;
	size: number;
	modify: number;
	access: number;
	type: string;
	mime: string;
}

interface IFolder
{
	name: string;
	modify: number;
	access: number;
	children: IFolder[];
	rolled: boolean;
	checked: boolean;
}
