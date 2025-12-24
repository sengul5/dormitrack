import React from 'react'

export const Table = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`w-full overflow-x-auto ${className}`}>
    <table className="w-full border-collapse text-left">{children}</table>
  </div>
)

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-transparent text-xs font-bold uppercase tracking-wider text-gray-400">
    <tr className="border-b border-gray-50">{children}</tr>
  </thead>
)

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="text-sm text-gray-700">{children}</tbody>
)

export const TableRow = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <tr
    className={`group border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/50 ${className}`}
  >
    {children}
  </tr>
)

export const TableHead = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => <th className={`pb-3 font-semibold ${className}`}>{children}</th>

export const TableCell = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => <td className={`py-3 ${className}`}>{children}</td>
