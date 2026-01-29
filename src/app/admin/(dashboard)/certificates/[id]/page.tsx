"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useCertificates } from "@/hooks/use-certificates"
import { CertificateFormData } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { toISODate, toISODateRequired } from "@/lib/utils"

const certificateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  description: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  issueDate: z.string().min(1, "Issue date is required"),
  expiryDate: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  order: z.number().optional(),
  isPublished: z.boolean(),
})

type CertificateFormValues = z.infer<typeof certificateSchema>

export default function CertificateFormPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id && id !== "new"

  const { getCertificate, createCertificate, updateCertificate, loading } = useCertificates()
  const [initialLoading, setInitialLoading] = React.useState(isEditing)

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: "",
      issuer: "",
      description: "",
      credentialId: "",
      credentialUrl: "",
      issueDate: "",
      expiryDate: "",
      image: "",
      order: 0,
      isPublished: true,
    },
  })

  React.useEffect(() => {
    if (isEditing) {
      getCertificate(id).then((certificate) => {
        if (certificate) {
          form.reset({
            name: certificate.name,
            issuer: certificate.issuer,
            description: certificate.description || "",
            credentialId: certificate.credentialId || "",
            credentialUrl: certificate.credentialUrl || "",
            issueDate: certificate.issueDate.split("T")[0],
            expiryDate: certificate.expiryDate?.split("T")[0] || "",
            image: certificate.image || "",
            order: certificate.order,
            isPublished: certificate.isPublished,
          })
        }
        setInitialLoading(false)
      })
    }
  }, [isEditing, id, getCertificate, form])

  const onSubmit = async (data: CertificateFormValues) => {
    const formData: CertificateFormData = {
      ...data,
      description: data.description || undefined,
      credentialId: data.credentialId || undefined,
      credentialUrl: data.credentialUrl || undefined,
      // expiryDate: data.expiryDate || undefined,
      issueDate: toISODateRequired(data.issueDate),
      expiryDate: data.expiryDate ? undefined : toISODate(data.expiryDate),
      image: data.image || undefined,
    }

    let result
    if (isEditing) {
      result = await updateCertificate(id, formData)
      if (result) {
        toast.success("Certificate updated successfully")
        router.push("/admin/certificates")
      } else {
        toast.error("Failed to update certificate")
      }
    } else {
      result = await createCertificate(formData)
      if (result) {
        toast.success("Certificate created successfully")
        router.push("/admin/certificates")
      } else {
        toast.error("Failed to create certificate")
      }
    }
  }

  if (initialLoading) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Certificate" : "Add Certificate"}
        description={isEditing ? "Update certificate details" : "Add a new certificate"}
        backHref="/admin/certificates"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Name</FormLabel>
                        <FormControl>
                          <Input placeholder="AWS Certified Solutions Architect" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issuer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuing Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Amazon Web Services" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the certification..."
                            className="min-h-25"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="credentialId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credential ID</FormLabel>
                          <FormControl>
                            <Input placeholder="ABC123XYZ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="credentialUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verification URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://verify.example.com/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Certificate Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/cert.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="issueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave empty if no expiration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Show on portfolio
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Order</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Certificate" : "Add Certificate"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
