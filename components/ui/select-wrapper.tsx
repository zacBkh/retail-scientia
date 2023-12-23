// import { FC, ReactNode } from 'react'
// import {
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
// } from '@/components/shad/ui/select'

// import Image from 'next/image'

// interface SelectWrapperProps<T> {
//   options: T
//   keyProperty: string
//   valueProperty: string
//   displayNameProperty: string
//   imgKey?: string

//   children?: ReactNode
// }

// const SelectWrapper: FC<SelectWrapperProps> = ({
//   options,
//   keyProperty,
//   valueProperty,
//   displayNameProperty,
//   imgKey,
//   children,
// }) => {
//   return (
//     <>
//       <SelectContent>
//         <SelectGroup>
//           <SelectLabel>Countries</SelectLabel>
//           {options.map((option) => (
//             <SelectItem key={option[keyProperty]} value={option[valueProperty]}>
//               <div className="flex items-center gap-x-3 my-2">
//                 <div>{option[displayNameProperty]}</div>
//                 <Image
//                   className="right-3"
//                   objectFit="contain"
//                   src={option[imgKey]}
//                   alt={`Flag of ${option[displayNameProperty]}`}
//                   width={30}
//                   height={30}
//                 />
//               </div>
//             </SelectItem>
//           ))}
//         </SelectGroup>
//       </SelectContent>
//     </>
//   )
// }

// export default SelectWrapper
