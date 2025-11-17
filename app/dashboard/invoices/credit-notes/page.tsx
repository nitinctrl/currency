"use client"

import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from 'lucide-react'

export default function CreditNotesPage() {
  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Credit Notes</h1>
            <p className="text-muted-foreground">Manage credit notes for invoice adjustments</p>
          </div>
          <Link href="/dashboard/invoices/credit-notes/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Credit Note
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Credit Notes</CardTitle>
            <CardDescription>View and manage your credit notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No credit notes yet. Create your first credit note to get started.
              </p>
              <Link href="/dashboard/invoices/credit-notes/new">
                <Button className="mt-4">Create Credit Note</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
