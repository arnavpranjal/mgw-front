// "use client";
// import { Backend_URL } from "@/lib/Constants";
// import React from "react";
// import axios from 'axios';

// export default function Page() {
//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     const formData = new FormData();

//     const username = e.target.elements.username.value;
//     // Assuming this code runs in a context where `e.target.elements.profilePicture` is defined:
//     const profilePicture = e.target.elements.profilePicture.files[0];

//     formData.append("username", username);
//     if (profilePicture) {
//       formData.append("profilePicture", profilePicture);
//     }

//     // Log each key-value pair in the FormData
//     for (let pair of formData.entries()) {
//       console.log(`${pair[0]}: ${pair[1]}`);
//     }

  
//     // Populate your formData as needed
    
//     axios.post(Backend_URL + "/user/file/", formData)
//       .then(function (response) {
//         console.log("Success:", response.data);
//         // Handle success scenario (e.g., showing a success message, redirecting, etc.)
//       })
//       .catch(function (error) {
//         console.error("Error:", error);
//         // Handle error scenario (e.g., showing an error message)
//       });
//   };

//   return (
//     <div>
//       <h1>Submit Your Info</h1>
//       <form onSubmit={(e) => handleSubmit(e)}>
//         <div>
//           <label htmlFor="username">Username:</label>
//           <input type="text" id="username" name="username" required />
//         </div>
//         <div>
//           <label htmlFor="profilePicture">Profile Picture:</label>
//           <input
//             type="file"
//             id="profilePicture"
//             name="profilePicture"
//             accept="image/*"
//           />
//         </div>
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// }
