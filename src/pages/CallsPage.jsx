import Header from "../components/common/Header";
import CallsTable from "../components/users/CallsTable";

const Calls = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Calls' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<CallsTable />
			</main>
		</div>
	);
};
export default Calls;
