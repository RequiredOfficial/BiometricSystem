import Header from '../../components/header/Header';
import AttendanceChart from '../../components/attendanceChart/AttendanceChart';
import Group from '../../components/group/Group';

export default function MainPage() {
  return (
    <div className="app">
      <Header />
      <AttendanceChart />
      <Group />
    </div>
  );
}