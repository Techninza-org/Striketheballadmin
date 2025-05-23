import Header from "../components/common/Header";
import StoreLogsTable from "../components/users/StoreLogsTable";

const StoreBookingLogsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Overs Played' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<StoreLogsTable />
			</main>
		</div>
	);
};
export default StoreBookingLogsPage;
