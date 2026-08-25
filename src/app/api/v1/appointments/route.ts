import { NextRequest, NextResponse } from 'next/server';
import { AppointmentsService } from '@/backend/services/appointments.service';

export async function GET(req: NextRequest) {
  try {
    const appointments = await AppointmentsService.getAllAppointments();
    return NextResponse.json({ success: true, data: appointments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await AppointmentsService.createAppointment(body);

    return NextResponse.json({ success: true, data: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
