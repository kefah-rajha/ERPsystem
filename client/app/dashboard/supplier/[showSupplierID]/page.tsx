"use client";
import Image from "next/image";
import {
  Pencil,
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  Percent,
  MapPin,
  Calendar,
  Package,
  Clock,
  Home,
  Mailbox,
  Share2,
  Download,
  Printer
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { AllSupplierResponse } from "@/dataType/dataTypeSupplier/dataTypeSupplier";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

export default function ShowSupplier() {
  const [data, setData] = useState<AllSupplierResponse>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    companyName: "",
    defaultTax: "",
    phone: "",
    mailingAddress: "",
    postCodeMiling: "",
    cityMiling: "",
    streetMiling: "",
    mailingCountry: "",
    address: "",
    postCode: "",
    city: "",
    street: "",
    country: "",
    createdAt: new Date()
  });

  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { push } = useRouter();
  const id = pathname?.split("/").pop();

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetch(`/api/supplier/getSupplier/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((jsonData) => {
        if (!ignore) {
          setData(jsonData.data);
          toast.success('Supplier data loaded successfully');
        }
      })
      .catch((err: unknown) => {
        console.log(err);
        toast.error('Failed to load supplier data');
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, [id, push]);

  // Get initials for avatar
  const getInitials = () => {
    if (data.companyName) {
      return data.companyName.substring(0, 2).toUpperCase();
    }
    return `${data.firstName.charAt(0)}${data.lastName.charAt(0)}`.toUpperCase();
  };

  // Format creation date
  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success(`${label} copied to clipboard`);
      })
      .catch(() => {
        toast.error('Failed to copy to clipboard');
      });
  };

  // Export supplier data as JSON
  const exportSupplierData = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      const exportFileDefaultName = `supplier-${data._id}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast.success('Supplier data exported successfully');
    } catch (error) {
      toast.error('Failed to export supplier data');
      console.error(error);
    }
  };

  // Print supplier information


  // Render table row with icon
  const renderTableRowWithIcon = (
    icon: React.ReactNode,
    label: string,
    value: string | undefined,
    badge?: {
      text: string;
      variant: "default" | "secondary" | "destructive" | "outline"
    },
    isCopyable: boolean = false
  ) => (
    <TableRow className="border-b">
      <TableCell className="py-4 pl-0">
        <div className="flex items-center gap-2">
          <div className="text-muted-foreground">{icon}</div>
          <strong className="text-foreground/80 font-medium">{label}</strong>
        </div>
      </TableCell>
      <TableCell className="py-4 font-light text-right">
        <div className="flex items-center justify-end gap-2">
          <span>{value || "-"}</span>
          {badge && value && (
            <Badge variant={badge.variant} className="ml-2">
              {badge.text}
            </Badge>
          )}
          {isCopyable && value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => copyToClipboard(value, label)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );

  // Get address string
  const getAddressString = (
    street?: string,
    city?: string,
    postCode?: string,
    country?: string
  ) => {
    const parts = [street, city, postCode, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "-";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading supplier information...</p>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="overflow-auto heighWithOutBar bg-gradient">
      {/* React Hot Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="container mx-auto py-6 px-4">
        {/* Header with back button and edit button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.history.back();
              toast.success('Navigating back');
            }}
            className="gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1 card-gradient"
              onClick={exportSupplierData}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>



            <Link href={`/dashboard/supplier/updateSupplier/${id}`}>
              <Button
                size="sm"
                variant="default"
                className="gap-1 card-gradient text-white"
                onClick={() => toast.success('Editing supplier')}
              >
                <Pencil className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Supplier</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Supplier header card */}
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
          <div className="bg-primary/10 p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-1 flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {data.companyName || `${data.firstName} ${data.lastName}`}
                  </h1>
                  <Badge variant="outline" className="md:ml-2 self-center">
                    Supplier
                  </Badge>
                </div>

                <div className="text-muted-foreground flex flex-col md:flex-row gap-4 mt-2">
                  {data.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span>{data.email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => copyToClipboard(data.email, 'Email')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </Button>
                    </div>
                  )}

                  {data.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{data.phone}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={() => copyToClipboard(data.phone, 'Phone')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                      </Button>
                    </div>
                  )}

                  {data.website && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <a
                        href={data.website.startsWith('http') ? data.website : `https://${data.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {data.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Added on {formatDate(data.createdAt)}
                </div>

                {data.defaultTax && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Percent className="h-3 w-3" />
                    Default Tax: {data.defaultTax}
                  </Badge>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 gap-1"
                  onClick={() => {
                    const shareText = `Supplier: ${data.companyName || `${data.firstName} ${data.lastName}`}\nEmail: ${data.email}\nPhone: ${data.phone}`;
                    copyToClipboard(shareText, 'Supplier contact info');
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs with supplier information */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="basic"
              className="flex gap-2 items-center"
              onClick={() => toast.success('Viewing basic info')}
            >
              <Building2 className="h-4 w-4" />
              <span>Basic Info</span>
            </TabsTrigger>
            <TabsTrigger
              value="physical"
              className="flex gap-2 items-center"
              onClick={() => toast.success('Viewing physical address')}
            >
              <Home className="h-4 w-4" />
              <span>Physical Address</span>
            </TabsTrigger>
            <TabsTrigger
              value="mailing"
              className="flex gap-2 items-center"
              onClick={() => toast.success('Viewing mailing address')}
            >
              <Mailbox className="h-4 w-4" />
              <span>Mailing Address</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card className="shadow-sm border-0">
              <CardContent className="pt-6">
                <Table>
                  <TableBody>
                    {renderTableRowWithIcon(
                      <User className="h-4 w-4" />,
                      "First Name",
                      data.firstName,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <User className="h-4 w-4" />,
                      "Last Name",
                      data.lastName,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Building2 className="h-4 w-4" />,
                      "Company Name",
                      data.companyName,
                      data.companyName ? { text: "Organization", variant: "outline" } : undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Mail className="h-4 w-4" />,
                      "Email",
                      data.email,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Phone className="h-4 w-4" />,
                      "Phone",
                      data.phone,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Globe className="h-4 w-4" />,
                      "Website",
                      data.website,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Percent className="h-4 w-4" />,
                      "Default Tax",
                      data.defaultTax,
                      data.defaultTax ? { text: "Tax Rate", variant: "secondary" } : undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Calendar className="h-4 w-4" />,
                      "Created At",
                      formatDate(data.createdAt),
                      undefined,
                      false
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Basic supplier information and contact details</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="physical">
            <Card className="shadow-sm border-0">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">Physical Location</Badge>
                  {getAddressString(data.street, data.city, data.postCode, data.country) !== "-" && (
                    <div className="bg-muted/50 p-4 rounded-lg mb-4 flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{data.address}</p>
                        <p className="text-muted-foreground">
                          {getAddressString(data.street, data.city, data.postCode, data.country)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-8 gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => copyToClipboard(
                            getAddressString(data.street, data.city, data.postCode, data.country),
                            'Physical address'
                          )}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          Copy address
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Separator className="my-6" />
                <Table>
                  <TableBody>
                    {renderTableRowWithIcon(
                      <MapPin className="h-4 w-4" />,
                      "Address",
                      data.address,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <MapPin className="h-4 w-4" />,
                      "Street",
                      data.street,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <MapPin className="h-4 w-4" />,
                      "City",
                      data.city,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <MapPin className="h-4 w-4" />,
                      "Post Code",
                      data.postCode,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <MapPin className="h-4 w-4" />,
                      "Country",
                      data.country,
                      data.country ? { text: data.country, variant: "outline" } : undefined,
                      true
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Physical address for shipping and visits</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="mailing">
            <Card className="shadow-sm border-0">
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-4">Mailing Address</Badge>
                  {getAddressString(data.streetMiling, data.cityMiling, data.postCodeMiling, data.mailingCountry) !== "-" && (
                    <div className="bg-muted/50 p-4 rounded-lg mb-4 flex items-start gap-3">
                      <Mailbox className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{data.mailingAddress}</p>
                        <p className="text-muted-foreground">
                          {getAddressString(data.streetMiling, data.cityMiling, data.postCodeMiling, data.mailingCountry)}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-8 gap-1 text-muted-foreground hover:text-foreground"
                          onClick={() => copyToClipboard(
                            getAddressString(data.streetMiling, data.cityMiling, data.postCodeMiling, data.mailingCountry),
                            'Mailing address'
                          )}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                          </svg>
                          Copy address
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Separator className="my-6" />
                <Table>
                  <TableBody>
                    {renderTableRowWithIcon(
                      <Mailbox className="h-4 w-4" />,
                      "Mailing Address",
                      data.mailingAddress,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Mailbox className="h-4 w-4" />,
                      "Street",
                      data.streetMiling,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Mailbox className="h-4 w-4" />,
                      "City",
                      data.cityMiling,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Mailbox className="h-4 w-4" />,
                      "Post Code",
                      data.postCodeMiling,
                      undefined,
                      true
                    )}
                    {renderTableRowWithIcon(
                      <Mailbox className="h-4 w-4" />,
                      "Country",
                      data.mailingCountry,
                      data.mailingCountry ? { text: data.mailingCountry, variant: "outline" } : undefined,
                      true
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mailbox className="h-4 w-4" />
                  <span>Address for mail and correspondence</span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}