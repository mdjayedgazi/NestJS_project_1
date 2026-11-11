import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Ticket } from './ticket.interface.js'
import { CreateTicketDto } from './dto/create-ticket.dto.js'
import { UpdateTicketDto } from './dto/update-ticket.dto.js';

@Injectable()
export class TicketsService {
  private readonly tickets: Ticket[] = [
    {
      id: 1,
      subject: 'Login issue',
      description: 'Unable to log into my account using valid credentials.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-09T08:15:00.000Z',
    },
    {
      id: 2,
      subject: 'Payment failed',
      description: 'Payment fails when checking out with a debit card.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-09T09:30:00.000Z',
    },
    {
      id: 3,
      subject: 'Invoice download not working',
      description: 'Invoice PDF download returns an empty file.',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-11-09T12:40:00.000Z',
    },
    {
      id: 4,
      subject: 'Password reset email missing',
      description: 'Password reset email is not arriving in the inbox.',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-11-09T13:10:00.000Z',
    },
    {
      id: 5,
      subject: 'Profile update error',
      description: 'Unable to save changes to the profile information.',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-11-09T14:25:00.000Z',
    },
    {
      id: 6,
      subject: 'Dashboard loading slowly',
      description: 'The dashboard takes more than 20 seconds to load.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-09T15:00:00.000Z',
    },
    {
      id: 7,
      subject: 'Account verification issue',
      description: 'Verification link shows an invalid or expired message.',
      priority: 'medium',
      status: 'closed',
      createdAt: '2026-11-09T16:20:00.000Z',
    },
    {
      id: 8,
      subject: 'Notification settings not saving',
      description: 'Notification preferences reset after refreshing the page.',
      priority: 'low',
      status: 'open',
      createdAt: '2026-11-09T17:45:00.000Z',
    },
    {
      id: 9,
      subject: 'Unable to upload profile image',
      description: 'Image upload fails when selecting a JPG or PNG file.',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-11-09T18:30:00.000Z',
    },
    {
      id: 10,
      subject: 'Duplicate transaction',
      description: 'The same transaction appears twice in the payment history.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-10T03:15:00.000Z',
    },
    {
      id: 11,
      subject: 'Search functionality broken',
      description: 'Search results do not match the entered keywords.',
      priority: 'medium',
      status: 'closed',
      createdAt: '2026-11-10T04:20:00.000Z',
    },
    {
      id: 12,
      subject: 'Mobile navigation issue',
      description: 'Navigation menu does not open correctly on mobile devices.',
      priority: 'low',
      status: 'open',
      createdAt: '2026-11-10T05:10:00.000Z',
    },
    {
      id: 13,
      subject: 'Subscription cancellation failed',
      description:
        'Unable to cancel the active subscription from account settings.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-10T06:35:00.000Z',
    },
    {
      id: 14,
      subject: 'Email address change request',
      description: 'Need assistance changing the registered email address.',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-11-10T07:00:00.000Z',
    },
    {
      id: 15,
      subject: 'API rate limit exceeded',
      description: 'API requests are returning HTTP 429 unexpectedly.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-10T08:45:00.000Z',
    },
    {
      id: 16,
      subject: 'Export report to CSV',
      description: 'CSV export produces incomplete report data.',
      priority: 'medium',
      status: 'open',
      createdAt: '2026-11-10T09:20:00.000Z',
    },
    {
      id: 17,
      subject: 'Dark mode preference not retained',
      description: 'Application switches back to light mode after logging in.',
      priority: 'low',
      status: 'closed',
      createdAt: '2026-11-10T10:15:00.000Z',
    },
    {
      id: 18,
      subject: 'Two-factor authentication issue',
      description:
        'Verification codes are rejected even when entered correctly.',
      priority: 'high',
      status: 'open',
      createdAt: '2026-11-10T11:30:00.000Z',
    },
  ]
  private nextTicketId = 19

  findAll(status?: Ticket['status'], priority?: Ticket['priority']) {
    let tickets = this.tickets

    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status)
    }
    if (priority) {
      tickets = tickets.filter((ticket) => ticket.priority === priority)
    }
    if (tickets.length === 0) {
      throw new NotFoundException(
        `Ticket with status ${status} and priority ${priority} not found`,
      )
    }

    return tickets
  }

  findOne(id: number) {
    const ticket = this.tickets.find((ticket) => ticket.id === id)

    if (!ticket) {
      throw new NotFoundException(`Ticket with ID ${id} not found`)
    }

    return ticket
  }

  create(createTicketDto: CreateTicketDto) {
    const ticket: Ticket = {
      id: this.nextTicketId++,
      subject: createTicketDto.subject,
      description: createTicketDto.description,
      priority: createTicketDto.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
    }
    this.tickets.push(ticket)

    return ticket
  }

  update(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = this.findOne(id)
    if (ticket.status === 'closed') {
      throw new BadRequestException(`Closed Ticket cannot be updated.`)
    }
    Object.assign(ticket, updateTicketDto)
    return ticket
  }

  closeTicket(id: number) {
    const ticket = this.findOne(id)

    if (ticket.status === 'closed') {
      throw new BadRequestException('Ticket is already closed.')
    }
    ticket.status = 'closed'
    return ticket
  }
}
