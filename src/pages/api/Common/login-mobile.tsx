import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../lib/prisma";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { Session } from "@prisma/client"; // Import Session type if needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
     //Check for Empty Payload
     try {
        const { username, password } = await req.body;
  
        if (!username || !password || !username && !password) {
          res.status(400).json({ message: 'Empty Payload' })
        }
    
        // Find the user by username
        const user = await prisma.staff.findUnique({ where: { username } });
    
        if (!user) {
            res.status(401).json({ message: 'Invalid username or password' })
        }
  
    
        // Validate the password
        // We know user is not null here due to the check above, use ! assertion
        if (password !== user!.password) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // --- Session Handling ---
        let sessionId: string;
        let session: Session | null = null;

        // 1. Check for existing valid session for this user
        // We know user is not null here, use ! assertion
        const existingSession = await prisma.session.findFirst({
          where: {
            staffId: user!.id,
            expiresAt: {
              gt: new Date(), // Check if expiry date is greater than now
            },
          },
        });

        if (existingSession) {
          // 2a. Reuse existing valid session
          sessionId = existingSession.id;
          session = existingSession;
          // Optionally update the expiry date if you want to extend it on login
          // await prisma.session.update({
          //   where: { id: sessionId },
          //   data: { expiresAt: dayjs().add(7, 'days').toDate() },
          // });
          console.log(`Reusing existing session: ${sessionId} for user ${user!.id}`); // Added ! assertion
        } else {
          // 2b. Create a new session if no valid one exists
          // We know user is not null here, use ! assertion
          sessionId = uuidv4();
          const expiresAt = dayjs().add(7, "days").toDate(); // Set expiry for new session
          session = await prisma.session.create({
            data: {
              id: sessionId,
              staffId: user!.id,
              expiresAt,
            },
          });
          console.log(`Created new session: ${sessionId} for user ${user!.id}`); // Added ! assertion
        }

        // 3. Return user details AND the session ID
        // We know user is not null here, use ! assertion
        return res.status(200).json({
          message: "Logged in successfully",
          id: user!.id,
          username: user!.username,
          branch: user!.branchId,
          sessionId: sessionId, // Include the session ID
          // You might want to include session expiry here too if needed on client
          // sessionExpiresAt: session.expiresAt,
        });
      } catch (error) {
        console.error("Login API Error:", error);
        res.status(500).json({ message: 'Login Failed' })
      }

}
