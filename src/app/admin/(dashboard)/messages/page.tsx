"use client"

import * as React from "react"
import { 
  MoreHorizontal, 
  Trash2, 
  MessageSquare,
  Star,
  Archive,
  Mail,
  MailOpen,
  Reply,
  Clock,
} from "lucide-react"
import { useMessages } from "@/hooks/use-messages"
import { Message } from "@/types/admin"
import { formatDate, getInitials } from "@/lib/utils"
import { PageHeader } from "@/components/admin/page-header"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function MessagesPage() {
  const { 
    messages, 
    loading, 
    error, 
    fetchMessages, 
    markAsRead, 
    toggleStar, 
    toggleArchive,
    markAsReplied,
    deleteMessage 
  } = useMessages()
  const [selectedMessage, setSelectedMessage] = React.useState<Message | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("inbox")

  React.useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message)
    if (!message.isRead) {
      await markAsRead(message.id)
    }
  }

  const handleToggleStar = async (id: string, isStarred: boolean) => {
    await toggleStar(id, !isStarred)
    toast.success(isStarred ? "Removed from starred" : "Added to starred")
  }

  const handleToggleArchive = async (id: string, isArchived: boolean) => {
    await toggleArchive(id, !isArchived)
    toast.success(isArchived ? "Unarchived" : "Archived")
    if (selectedMessage?.id === id) {
      setSelectedMessage(null)
    }
  }

  const handleMarkAsReplied = async (id: string) => {
    await markAsReplied(id)
    toast.success("Marked as replied")
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteMessage(deleteId)
    if (success) {
      toast.success("Message deleted successfully")
      if (selectedMessage?.id === deleteId) {
        setSelectedMessage(null)
      }
    } else {
      toast.error("Failed to delete message")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const filteredMessages = messages.filter((message) => {
    switch (activeTab) {
      case "inbox":
        return !message.isArchived
      case "unread":
        return !message.isRead && !message.isArchived
      case "starred":
        return message.isStarred && !message.isArchived
      case "archived":
        return message.isArchived
      default:
        return true
    }
  })

  const unreadCount = messages.filter((m) => !m.isRead && !m.isArchived).length
  const starredCount = messages.filter((m) => m.isStarred && !m.isArchived).length

  if (loading && messages.length === 0) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Manage contact form submissions"
      />

      <Tabs   defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox" className="gap-2">
            <Mail className="h-4 w-4" />
            Inbox
          </TabsTrigger>
          <TabsTrigger value="unread" className="gap-2">
            <MailOpen className="h-4 w-4" />
            Unread
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="starred" className="gap-2">
            <Star className="h-4 w-4" />
            Starred
            {starredCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {starredCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-2">
            <Archive className="h-4 w-4" />
            Archived
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredMessages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={`No ${activeTab} messages`}
              description={
                activeTab === "inbox"
                  ? "You don't have any messages yet."
                  : `No messages in ${activeTab}.`
              }
            />
          ) : (
            <div className="space-y-2">
              {filteredMessages.map((message) => (
                <Card
                  key={message.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                    !message.isRead && "bg-violet-50/50 dark:bg-violet-900/10"
                  )}
                  onClick={() => handleSelectMessage(message)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback>{getInitials(message.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium text-zinc-900 dark:text-zinc-100",
                              !message.isRead && "font-semibold"
                            )}>
                              {message.name}
                            </span>
                            {!message.isRead && (
                              <span className="h-2 w-2 rounded-full bg-violet-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-500">
                              {formatDate(message.createdAt)}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleStar(message.id, message.isStarred)
                                  }}
                                >
                                  <Star className={cn("mr-2 h-4 w-4", message.isStarred && "fill-amber-400")} />
                                  {message.isStarred ? "Unstar" : "Star"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleToggleArchive(message.id, message.isArchived)
                                  }}
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  {message.isArchived ? "Unarchive" : "Archive"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setDeleteId(message.id)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-500">{message.email}</p>
                        {message.subject && (
                          <p className="font-medium text-sm mt-1">{message.subject}</p>
                        )}
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2">
                          {message.content}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {message.isStarred && (
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          )}
                          {message.repliedAt && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <Reply className="h-3 w-3" />
                              Replied
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Message Detail Sheet */}
      <Sheet open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedMessage && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedMessage.subject || "No Subject"}</SheetTitle>
                <SheetDescription>
                  From {selectedMessage.name} ({selectedMessage.email})
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Clock className="h-4 w-4" />
                  {formatDate(selectedMessage.createdAt)}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStar(selectedMessage.id, selectedMessage.isStarred)}
                  >
                    <Star className={cn("mr-2 h-4 w-4", selectedMessage.isStarred && "fill-amber-400")} />
                    {selectedMessage.isStarred ? "Unstar" : "Star"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleArchive(selectedMessage.id, selectedMessage.isArchived)}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    {selectedMessage.isArchived ? "Unarchive" : "Archive"}
                  </Button>
                  {!selectedMessage.repliedAt && (
                    <Button onClick={() => handleMarkAsReplied(selectedMessage.id)}>
                      <Reply className="mr-2 h-4 w-4" />
                      Mark Replied
                    </Button>
                  )}
                </div>
                <div className="pt-4">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Your message"}`}
                    className="text-sm text-violet-600 hover:underline"
                  >
                    Reply via email →
                  </a>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Message"
        description="Are you sure you want to delete this message? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
