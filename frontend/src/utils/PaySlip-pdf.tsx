import type { SalaryPaySlipPdfData } from '@/types/payrollTypes'
import React from 'react'



interface PayslipComponentProps {
  data: SalaryPaySlipPdfData
  logoUrl: string
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const PayslipComponent: React.FC<PayslipComponentProps> = ({
  data,
  logoUrl,
}) => {
  const hasDeductions = data.deductions.items.length > 0
  const monthName = MONTHS[data.month - 1]
  const payPeriodDisplay = `${monthName} ${data.year}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1] p-5 font-[Inter] antialiased lg:flex lg:min-h-screen lg:items-start lg:justify-center lg:px-5 lg:py-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .payslip-container {
            width: 210mm !important;
            height: 297mm !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            page-break-after: always !important;
          }
          .employee-summary,
          .earnings-deductions,
          .net-payable {
            page-break-inside: avoid !important;
          }
        }
        
        @page {
          size: A4;
          margin: 0;
        }
      `}</style>

      {/* A4 Container - 210mm × 297mm */}
      <div className="payslip-container mx-auto flex h-[297mm] w-[210mm] max-w-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08),0_0_1px_rgba(0,0,0,0.1)] md:h-auto md:w-full md:rounded-lg">
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between border-b-2 border-[#f0f3f7] bg-gradient-to-b from-white to-[#fafbfc] px-7 py-6 md:flex-col md:gap-4 md:px-5">
          <div className="flex items-center gap-3.5">
            <img
              src={logoUrl}
              alt="Company Logo"
              className="h-[38px] w-[38px] shrink-0 sm:h-12 sm:w-12"
            />
            <div>
              <h1 className="mb-1 text-lg leading-tight font-bold tracking-[-0.3px] text-[#1a1f36] sm:text-base">
                {data.companyInfo.name}
              </h1>
              <p className="max-w-[320px] text-[11px] leading-[1.5] font-normal text-[#6b7280] sm:text-[10px]">
                {data.companyInfo.address}
                <br />
                {data.companyInfo.city}, {data.companyInfo.state},{' '}
                {data.companyInfo.country}
                <br />
              </p>
            </div>
          </div>

          <div className="mt-[18px] flex h-max flex-col items-end gap-0.5 text-right md:mt-0 md:items-start md:text-left">
            <p className="m-0 mb-1 text-[11px] font-medium tracking-[0.5px] text-[#6b7280] uppercase">
              Payslip For the Month
            </p>
            <h2 className="m-0 text-base font-bold tracking-[-0.2px] text-[#1a1f36]">
              {payPeriodDisplay}
            </h2>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col px-7 py-6 md:px-5">
          {/* Employee Summary */}
          <section className="mb-6">
            <h3 className="mb-4 text-xs font-bold tracking-[0.8px] text-[#374151] uppercase">
              Employee Summary
            </h3>

            <div className="grid grid-cols-[1fr_auto] items-start gap-6 md:grid-cols-1 md:gap-5">
              {/* Summary Details */}
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-[150px_8px_1fr] items-center gap-1.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Employee Name
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.employeeName}
                  </span>
                </div>

                <div className="grid grid-cols-[150px_8px_1fr] items-center gap-1.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Designation
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.designation}
                  </span>
                </div>

                <div className="grid grid-cols-[150px_8px_1fr] items-center gap-1.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Employee ID
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.employeeCode}
                  </span>
                </div>

                <div className="grid grid-cols-[150px_8px_1fr] items-center gap-1.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Date of Joining
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.dateOfJoining}
                  </span>
                </div>

                <div className="grid grid-cols-[150px_8px_1fr] items-center gap-1.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Pay Period
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.payPeriod}
                  </span>
                </div>

                <div className="grid grid-cols-[150px_8px_1fr] items-center gap-1.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Pay Date
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.payDate}
                  </span>
                </div>

                <div className="mt-2.5 grid grid-cols-[150px_8px_1fr] items-center gap-1.5 border-t border-[#f0f3f7] pt-2.5 sm:grid-cols-1 sm:gap-0.5 md:grid-cols-[130px_8px_1fr] md:gap-1">
                  <span className="text-xs font-medium text-[#6b7280]">
                    Bank Account No
                  </span>
                  <span className="text-xs text-[#9ca3af] sm:hidden">:</span>
                  <span className="text-xs font-semibold text-[#1a1f36]">
                    {data.employeeSummary.bankAccountNo}
                  </span>
                </div>
              </div>

              {/* Net Pay Card */}
              <div className="max-w-[220px] min-w-[200px] overflow-hidden rounded-[10px] border-2 border-[#d1d5db] bg-white p-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] md:w-full md:max-w-full md:min-w-0">
                <div className="bg-[#0596681f] p-2.5">
                  <div className="mb-1 text-center text-[26px] font-bold tracking-[-0.5px] text-[#059669] sm:text-[22px]">
                    ₹
                    {data.netPay.amount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <div className="text-center text-[11px] font-semibold tracking-[0.5px] text-[#6b7280] uppercase">
                    Total Net Pay
                  </div>
                </div>

                <div className="flex justify-between border-t border-[#e5e7eb] px-2.5 pt-3.5 pb-2.5 sm:flex-col">
                  <div className="flex flex-col items-center gap-[3px] sm:w-full sm:flex-row sm:justify-between">
                    <span className="text-[9px] font-semibold tracking-[0.5px] text-[#6b7280] uppercase">
                      Paid Days
                    </span>
                    <span className="text-[15px] font-bold text-[#1a1f36]">
                      {data.attendanceSummary.paidDays}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-[3px] sm:w-full sm:flex-row sm:justify-between">
                    <span className="text-[9px] font-semibold tracking-[0.5px] text-[#6b7280] uppercase">
                      LOP Days
                    </span>
                    <span className="text-[15px] font-bold text-[#1a1f36]">
                      {data.attendanceSummary.lopDays}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Earnings and Deductions */}
          <section className="mb-6 grid grid-cols-2 gap-6 md:grid-cols-1 md:gap-5">
            {/* Earnings */}
            <div className="flex flex-col">
              <h3 className="mb-3 text-xs font-bold tracking-[0.8px] text-[#374151] uppercase">
                Earnings
              </h3>

              <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-[#e5e7eb]">
                <thead>
                  <tr className="bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6]">
                    <th className="border-b-2 border-[#e5e7eb] p-3 text-left text-[10px] font-bold tracking-[0.5px] text-[#374151] uppercase sm:px-1.5 sm:py-2 sm:text-[9px]"></th>
                    <th className="border-b-2 border-[#e5e7eb] p-3 text-right text-[10px] font-bold tracking-[0.5px] text-[#374151] uppercase sm:px-1.5 sm:py-2 sm:text-[9px]">
                      Amount
                    </th>
                    <th className="border-b-2 border-[#e5e7eb] p-3 text-right text-[10px] font-bold tracking-[0.5px] text-[#374151] uppercase sm:px-1.5 sm:py-2 sm:text-[9px]">
                      YTD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.earnings.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border-b border-[#f3f4f6] p-3 text-xs font-medium text-[#1a1f36] sm:px-1.5 sm:py-2 sm:text-[11px]">
                        {item.description}
                      </td>
                      <td className="border-b border-[#f3f4f6] p-3 text-right text-xs font-semibold text-[#1a1f36] tabular-nums sm:px-1.5 sm:py-2 sm:text-[11px]">
                        ₹
                        {item.amount.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="border-b border-[#f3f4f6] p-3 text-right text-xs font-semibold text-[#1a1f36] tabular-nums sm:px-1.5 sm:py-2 sm:text-[11px]">
                        ₹
                        {item.ytd.toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6]">
                    <td className="p-3 text-xs font-bold text-[#111827] sm:px-1.5 sm:py-2 sm:text-[11px]">
                      Gross Earnings
                    </td>
                    <td className="p-3 text-right text-xs font-bold text-[#111827] tabular-nums sm:px-1.5 sm:py-2 sm:text-[11px]">
                      ₹
                      {data.earnings.grossEarnings.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-3 text-right text-xs font-bold text-[#111827] sm:px-1.5 sm:py-2 sm:text-[11px]"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions */}
            <div className="flex flex-col">
              <h3 className="mb-3 text-xs font-bold tracking-[0.8px] text-[#374151] uppercase">
                Deductions
              </h3>

              <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg border border-[#e5e7eb]">
                <thead>
                  <tr className="bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6]">
                    <th className="border-b-2 border-[#e5e7eb] p-3 text-left text-[10px] font-bold tracking-[0.5px] text-[#374151] uppercase sm:px-1.5 sm:py-2 sm:text-[9px]"></th>
                    <th className="border-b-2 border-[#e5e7eb] p-3 text-right text-[10px] font-bold tracking-[0.5px] text-[#374151] uppercase sm:px-1.5 sm:py-2 sm:text-[9px]">
                      Amount
                    </th>
                    <th className="border-b-2 border-[#e5e7eb] p-3 text-right text-[10px] font-bold tracking-[0.5px] text-[#374151] uppercase sm:px-1.5 sm:py-2 sm:text-[9px]">
                      YTD
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!hasDeductions ? (
                    <tr className="h-40">
                      <td
                        colSpan={3}
                        className="border-b border-[#f3f4f6] text-center align-middle text-xs text-[#9ca3af] italic"
                      >
                        No deductions
                      </td>
                    </tr>
                  ) : (
                    data.deductions.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border-b border-[#f3f4f6] p-3 text-xs font-medium text-[#1a1f36] sm:px-1.5 sm:py-2 sm:text-[11px]">
                          {item.description}
                        </td>
                        <td className="border-b border-[#f3f4f6] p-3 text-right text-xs font-semibold text-[#1a1f36] tabular-nums sm:px-1.5 sm:py-2 sm:text-[11px]">
                          ₹
                          {item.amount.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="border-b border-[#f3f4f6] p-3 text-right text-xs font-semibold text-[#1a1f36] tabular-nums sm:px-1.5 sm:py-2 sm:text-[11px]">
                          ₹
                          {item.ytd.toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                  <tr className="bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6]">
                    <td className="p-3 text-xs font-bold text-[#111827] sm:px-1.5 sm:py-2 sm:text-[11px]">
                      Total Deductions
                    </td>
                    <td className="p-3 text-right text-xs font-bold text-[#111827] tabular-nums sm:px-1.5 sm:py-2 sm:text-[11px]">
                      ₹
                      {data.deductions.totalDeductions.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-3 text-right text-xs font-bold text-[#111827] sm:px-1.5 sm:py-2 sm:text-[11px]"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Net Payable */}
          <div className="mb-5 overflow-hidden rounded-[10px] border-2 border-[#d1d5db] bg-white p-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <div className="flex flex-row items-stretch justify-between">
              <div className="flex-1 p-5">
                <div className="mb-[3px] text-[13px] font-bold tracking-[0.5px] text-[#374151]">
                  TOTAL NET PAYABLE
                </div>
                <div className="text-[10px] font-medium text-[#6b7280]">
                  {data.netPay.formula}
                </div>
              </div>

              <div className="flex items-center justify-center bg-[#0596681f] p-5">
                <span className="text-[26px] font-bold tracking-[-0.5px] text-[#059669] tabular-nums sm:text-[22px]">
                  ₹
                  {data.netPay.amount.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Amount in Words */}
          <div className="mb-0 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] p-3.5 text-center text-[11px] font-medium text-[#6b7280] italic">
            Amount In Words : {data.netPay.amountInWords}
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t-2 border-[#f0f3f7] bg-[#fafbfc] p-4 text-center text-[10px] font-medium text-[#9ca3af]">
          -- This is a system generated document. --
        </footer>
      </div>
    </div>
  )
}



export default PayslipComponent
