// backend apis with which this file is dealing with

/*
router.post('/addProfile' , completeProfile ); //tested : working fine
router.get('/login-check', loginCheck);  //tested : working fine
router.post('/approve-user/:id', approveUser); // tested : working fine 
router.post('/generate-codes', generateCodes); // working
router.post('/login-with-code', loginWithCode); // working
router.post('/update-password' , changePasswordAfterCodeLogin) //working

*/


// imports
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// schema imports 
import { loginCheckResponseSchema } from "~/types/responseTypes/authResponses";
import { locationsSchema } from "~/types/location";


const BASE_URL = "https://7b89e3952de0.ngrok-free.app/api/auth";


// the auth router
// this router handles all the authentication related operations
export const authRouter = createTRPCRouter({

  // this is to complete the profile of a user
  // this is called when a user signs in for the first time
  completeProfile: publicProcedure
    .input(z.object(
      {
        name: z.string(),
        email: z.string().email(),
        fullName: z.string(),
        phone: z.string(),
        locationId: z.string(),
        role: z.string(),
        department: z.string(),
        designation: z.string(),
        officeNumber: z.string()
      }
    ))
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(`${BASE_URL}/addProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      return await res.json();
    }),


    // this is to approve a user
  // calling this when the manager approves a user (from the admin dashboard)
  approveUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(`${BASE_URL}/approve-user/${input.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.token}`,
        },
      });
      return await res.json();
    }),


     // this is to login if the user forgots his password and uses the previously generated codes at the time of profile completion
  loginWithCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(`${BASE_URL}/login-with-code`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: input.code }),
        credentials: "include",
      });
      return await res.json();
    }),


  // this is to update the password after the user logs in with the code
  updatePassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(`${BASE_URL}/update-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
        credentials: "include",
      });
      return await res.json();
    }),

  // this is to check if the user exists and is approved
  // calling it when the user signs in
  // this will redirect the user to the appropriate page based on the response
  loginCheck: publicProcedure.query(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/login-check`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    const json = await res.json();
    return loginCheckResponseSchema.parse(json);
  }),


  // this is to generate codes for the user (when the user completes and submits his profile )
  generateCodes: publicProcedure.mutation(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/generate-codes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    return await res.json();
  }),


  // this is to fetch all the locations (for the dropdown)
  getLocations: publicProcedure.query(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/locations`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    const json = await res.json();
    return locationsSchema.array().parse(json);
  }),


 
});

