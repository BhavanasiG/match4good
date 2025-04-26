'use client';

import { User } from '@/lib/prisma';
// TODO
//import { ChangeEvent, FormEvent, useState } from "react";
//import { createInterests, CreateInterestsData } from "./submit";

export interface SignUpFormProps {
  user: User;
}

// TODO
// export default function SignUpForm({ user }: SignUpFormProps) {
//   const [error, setError] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");

//   const [form_data, setFormData] = useState<createInterestsData>({
//     interests: [],
//   });

//   const onChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     if (checked) {
//       setFormData((prev_data) => ({
//         ...prev_data,
//         interests: [...prev_data.interests, Number(name)],
//       }));
//     } else {
//       setFormData((prev_data) => ({
//         ...prev_data,
//         interests: prev_data.interests.filter(
//           (interest) => interest !== Number(name)
//         ),
//       }));
//     }
//   };

//   const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (form_data.interests.length < 3) {
//       setError("Please select at least 3 interests.");
//       return;
//     }

//     const error = await createInterests(form_data);
//     if (error) {
//       setError(error);
//     } else {
//       setSuccess("Interests created successfully!");
//     }
//   };

//   return ()
// }
