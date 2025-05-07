import Header from "../components/common/Header";
import ClientsTable from "../components/users/ClientsTable";

const Clients = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Clients' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <ClientsTable />
			</main>
		</div>
	);
};
export default Clients;
