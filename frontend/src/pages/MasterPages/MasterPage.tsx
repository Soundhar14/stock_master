import ConfigCard, {
  type ConfigCardtype,
} from '../../components/common/ConfigCard'
import PageHeader from '../../components/masterPage.components/PageHeader'
import { appRoutes } from '../../routes/appRoutes'

export const MasterPage = () => {
  const configCards: ConfigCardtype[] = [
    {
      img: '/icons/Configpage/Branch.svg',
      title: 'Warehouse',
      desc: 'Manage office WareHouse to streamline your organizational structure.',
      label: 'Organisation',
      labelColor: 'bg-red-100 text-red-800',
      btnText: 'Configure',
      navigateUrl: appRoutes.masterRoutes.children.warehouse,
    },
    {
      img: '/icons/Configpage/Department.svg',
      title: 'Products',
      desc: 'Define Products to organize Warehouse and responsibilities effectively.',
      label: 'Organisation',
      labelColor: 'bg-red-100 text-red-800',
      btnText: 'Configure',
      navigateUrl: appRoutes.masterRoutes.children.products,
    },
    {
      img: '/icons/Configpage/Desigination.svg',
      title: 'Category',
      desc: 'Create and manage Category to maintain Product Category and hierarchy.',
      label: 'Organisation',
      labelColor: 'bg-yellow-100 text-yellow-800',
      btnText: 'Configure',
      navigateUrl: appRoutes.masterRoutes.children.Category,
    },
    {
      img: '/icons/Configpage/Desigination.svg',
      title: 'Users',
      desc: 'Manage application users, roles, and contact details in one place.',
      label: 'Administration',
      labelColor: 'bg-blue-100 text-blue-800',
      btnText: 'Configure',
      navigateUrl: appRoutes.masterRoutes.children.users,
    },
    // {
    //   img: '/icons/Configpage/Resigination.png',
    //   title: 'Resignation',
    //   desc: 'Track and manage employee resignations efficiently with proper records.',
    //   label: 'HR Essentials',
    //   labelColor: 'bg-yellow-100 text-yellow-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.resignations,
    // },
    // {
    //   img: '/icons/Configpage/BloodGroup.svg',
    //   title: 'Blood Group',
    //   desc: 'Store employee blood group information for emergencies and health records.',
    //   label: 'HR Essentials',
    //   labelColor: 'bg-yellow-100 text-yellow-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.bloodGroups,
    // },
    // {
    //   img: '/icons/Configpage/Attendance.svg',
    //   title: 'Attendance',
    //   desc: 'Monitor and manage employee attendance accurately every day.',
    //   label: 'Attendance',
    //   labelColor: 'bg-green-100 text-green-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.attendance,
    // },
    // // {
    // //   img: '/icons/Configpage/Permission.svg',
    // //   title: 'Permission',
    // //   desc: 'Allow short leaves and approvals through permission logs efficiently.',
    // //   label: 'Attendance',
    // //   labelColor: 'bg-green-100 text-green-800',
    // //   btnText: 'Configure',
    // //   navigateUrl : appRoutes.masterRoutes.children.permissions,
    // // },
    // {
    //   img: '/icons/Configpage/Lop.svg',
    //   title: 'LOB',
    //   desc: 'Track leave opening balances and unpaid leaves accurately.',
    //   label: 'Attendance',
    //   labelColor: 'bg-green-100 text-green-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.allowances,
    // },
    // {
    //   img: './icons/Configpage/Shift.svg',
    //   title: 'Shift',
    //   desc: 'Define work shifts and allocate employees effectively with ease.',
    //   label: 'Attendance',
    //   labelColor: 'bg-green-100 text-green-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.shifts,
    // },
    // {
    //   img: '/icons/Configpage/Holiday.svg',
    //   title: 'Holiday',
    //   desc: 'Plan and manage company holidays and off days efficiently.',
    //   label: 'Holiday & Benefits',
    //   labelColor: 'bg-purple-100 text-purple-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.holidays,
    // },
    // {
    //   img: '/icons/Configpage/Loan.svg',
    //   title: 'Loan',
    //   desc: 'Track employee loans, eligibility and repayment details easily.',
    //   label: 'Holiday & Benefits',
    //   labelColor: 'bg-purple-100 text-purple-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.loans,
    // },
    // {
    //   img: '/icons/Configpage/Allowance.svg',
    //   title: 'Allowance',
    //   desc: 'Configure allowances provided to employees beyond regular salary.',
    //   label: 'Holiday & Benefits',
    //   labelColor: 'bg-purple-100 text-purple-800',
    //   btnText: 'Configure',
    //   navigateUrl: appRoutes.masterRoutes.children.allowances,
    // },
  ]

  return (
    <div className="flex w-full max-w-[1590px] flex-col gap-6">
      <section className="table-container flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <header className="flex flex-row items-center justify-between">
          <PageHeader title="Master Configuration" />
        </header>
      </section>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {configCards.map((card, index) => (
          <ConfigCard
            key={index}
            img={card.img}
            title={card.title}
            desc={card.desc}
            label={card.label}
            labelColor={card.labelColor}
            btnText={card.btnText}
            navigateUrl={card.navigateUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default MasterPage
