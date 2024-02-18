import React from 'react'

type Props = {
  className?: string
}

export const GoogleIcon = ({ className }: Props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={className}
  >
    <path
      d="M12.804 5.76932C12.886 6.20865 12.9307 6.66798 12.9307 7.14732C12.9307 10.8967 10.4213 13.5627 6.63133 13.5627C5.76944 13.5629 4.91593 13.3933 4.1196 13.0636C3.32326 12.7339 2.59969 12.2505 1.99024 11.6411C1.38079 11.0316 0.897395 10.3081 0.567683 9.51172C0.237971 8.71538 0.0684021 7.86188 0.0686649 6.99998C0.0684021 6.13809 0.237971 5.28459 0.567683 4.48825C0.897395 3.69191 1.38079 2.96834 1.99024 2.35889C2.59969 1.74944 3.32326 1.26605 4.1196 0.936335C4.91593 0.606623 5.76944 0.437054 6.63133 0.437317C8.40333 0.437317 9.884 1.08932 11.02 2.14798L9.17 3.99798V3.99332C8.48133 3.33732 7.60733 3.00065 6.63133 3.00065C4.466 3.00065 2.706 4.82998 2.706 6.99598C2.706 9.16132 4.466 10.9947 6.63133 10.9947C8.596 10.9947 9.93333 9.87132 10.208 8.32865H6.63133V5.76932H12.8047H12.804Z"
      fill="#0E0E12"
    />
  </svg>
)