import { prisma } from "@/config";

async function createBooking(userId:number, roomId:number){
  return prisma.booking.create({
    data:{
        userId,
        roomId
    }
  })
}

async function findManyBooking(roomId: number){
    return prisma.room.findMany({
      where:{
        id: roomId
      }
    })
  }
  
  async function findFirstRoom(roomId: number){
    return prisma.room.findFirst({
      where:{
        id:roomId
      }
    })
  }

  async function findUserId(userId: number) {
    return await prisma.booking.findFirst({
      where: { userId },
      select: { 
        id: true,
        Room: true 
      },
    });
  }

  
  const bookingRepository = {
      createBooking,
      findManyBooking,
      findFirstRoom,
      findUserId
  }
  
  export default bookingRepository;