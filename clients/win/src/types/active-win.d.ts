declare module "active-win" {
	type Bounds = { x: number; y: number; height: number; width: number };

	type ActiveWindowOwner = {
		name?: string;
		processId?: number;
		path?: string;
	} | null;

	type ActiveWindow = {
		title?: string;
		id?: number;
		owner?: ActiveWindowOwner;
		bounds?: Bounds | null;
		memoryUsage?: number;
	} | null;

	function activeWin(): Promise<ActiveWindow>;

	export default activeWin;
}
