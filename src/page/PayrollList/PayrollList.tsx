import React from 'react'
import TablePayroll from '../../components/TablePayroll/TablePayroll'
import FilterTable from '../../components/FilterTable/FilterTable'

type Props = {}

const PayrollList = (props: Props) => {
  return (
    <div>
      <FilterTable />
      <TablePayroll />
    </div>
  )
}

export default PayrollList