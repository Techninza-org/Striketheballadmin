import Header from "../components/common/Header";
import AdminLogsTable from "../components/users/AdminLogsTable";

const AdminBookingLogsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Logs' />
			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<AdminLogsTable />
			</main>
		</div>
	);
};
export default AdminBookingLogsPage;
