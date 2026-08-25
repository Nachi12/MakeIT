import { db } from '../database/db';

export class AppointmentsService {
  static async getAllAppointments() {
    return await db.appointment.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  static async createAppointment(data: any) {
    const id = data.id || `cons-${Date.now()}`;
    return await db.appointment.create({
      data: {
        id,
        expertId: data.expertId,
        expertName: data.expertName || 'Technology Specialist',
        expertTitle: data.expertTitle || 'Senior Architect',
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || '',
        date: data.date,
        timeSlot: data.timeSlot,
        consultationType: data.consultationType || '30 min Deep Dive',
        topic: data.topic || 'Technology consultation',
        status: data.status || 'SCHEDULED',
        meetingUrl: data.meetingUrl || `https://meet.jit.si/MakeIT-Cons-${Date.now().toString().slice(-4)}`
      }
    });
  }

  static async updateAppointmentStatus(id: string, status: string) {
    return await db.appointment.update({
      where: { id },
      data: { status }
    });
  }
}
