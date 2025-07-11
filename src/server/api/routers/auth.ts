// backend apis with which this file is dealing with

// router.post('/addProfile' , completeProfile ); //tested : working fine
// router.get('/login-check', loginCheck);  //tested : working fine
// router.post('/approve-user/:id', approveUser); // tested : working fine 
// router.post('/generate-codes', generateCodes); // working
// router.post('/login-with-code', loginWithCode); // working
// router.post('/update-password' , changePasswordAfterCodeLogin) //working


// imports
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// schema imports 
import { loginCheckResponseSchema } from "~/types/responseTypes/authResponses";
import { locationSchema } from "~/types/responseTypes/authResponses";


const BASE_URL = "https://3250412b8b30.ngrok-free.app/api/auth";

// Create and export the auth router
export const authRouter = createTRPCRouter({
  completeProfile: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() , fullName: z.string(), phone: z.string(), locationId: z.string(), role: z.string(), department: z.string(), designation: z.string(), officeNumber: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await fetch(`${BASE_URL}/addProfile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      console.log(input);
      return await res.json();
    }),

  loginCheck: publicProcedure.query(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/login-check`, {
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });

    const json = await res.json();
    return loginCheckResponseSchema.parse(json);
  }),

  // this is to approve a user
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

  generateCodes: publicProcedure.mutation(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/generate-codes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    return await res.json();
  }),

  // this is to fetch all the locations
  getLocations: publicProcedure.query(async ({ ctx }) => {
    const res = await fetch(`${BASE_URL}/locations`, {    
      headers: {
        Authorization: `Bearer ${ctx.token}`,
      },
    });
    const json =  await res.json();
    return locationSchema.array().parse(json);
  }),

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

  updatePassword: publicProcedure
    .input(
      z.object({
        password: z.string().min(6),
        confirmPassword: z.string().min(6),
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
});

