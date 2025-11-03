"use client";

import { mockBookings, mockGardens, mockUsers, mockClaims } from '../data/mockData';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, DollarSign, Home, Users, CheckCircle, Clock, XCircle, Check, X, Edit, Trash2, Shield, Mail, QrCode, AlertTriangle, FileText } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Claim } from '../types/garden';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Garden, User as UserType, UserRole } from '../types/garden';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Dashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [pendingGardens, setPendingGardens] = useState(mockGardens.slice(0, 3));
  const [myGardens, setMyGardens] = useState<Garden[]>(mockGardens.slice(0, 2));
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  
  // Edit Garden Dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingGarden, setEditingGarden] = useState<Garden | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    location: '',
    price: 0,
    capacity: 0,
    size: 0,
  });

  // Delete Garden Alert Dialog
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deletingGardenId, setDeletingGardenId] = useState<string | null>(null);

  // User Management
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [deleteUserAlertOpen, setDeleteUserAlertOpen] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  
  // Booking Dialogs
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<typeof mockBookings[0] | null>(null);
  
  // Claim Form
  const [claimForm, setClaimForm] = useState({
    title: '',
    description: '',
    category: 'service_issue' as Claim['category'],
  });

  // Admin Claim Management
  const [adminClaimDialogOpen, setAdminClaimDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
       
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to access the dashboard.</p>
          <Link href="/auth">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const userBookings = mockBookings.filter((b) => b.userId === user.id);
  
  const stats = [
    {
      label: 'Total Bookings',
      value: userBookings.length,
      icon: Calendar,
      color: 'text-primary',
    },
    {
      label: 'Total Spent',
      value: `$${userBookings.reduce((sum, b) => sum + b.totalPrice, 0)}`,
      icon: DollarSign,
      color: 'text-secondary',
    },
    {
      label: 'Listed Gardens',
      value: user.role === 'owner' ? 2 : 0,
      icon: Home,
      color: 'text-accent-foreground',
    },
    {
      label: 'Profile Views',
      value: '1.2k',
      icon: Users,
      color: 'text-muted-foreground',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleVerifyGarden = (gardenId: string) => {
    setPendingGardens(prev => prev.filter(g => g.id !== gardenId));
    toast.success('Garden listing approved!', {
      description: 'The owner has been notified.'
    });
  };

  const handleRejectGarden = (gardenId: string) => {
    setPendingGardens(prev => prev.filter(g => g.id !== gardenId));
    toast.error('Garden listing rejected', {
      description: 'The owner has been notified.'
    });
  };

  // Garden Management Functions
  const handleEditGarden = (garden: Garden) => {
    setEditingGarden(garden);
    setEditForm({
      name: garden.name,
      description: garden.description,
      location: garden.location,
      price: garden.price,
      capacity: garden.capacity,
      size: garden.size,
    });
    setEditDialogOpen(true);
  };

  const handleSaveGarden = () => {
    if (!editingGarden) return;

    setMyGardens(prev => prev.map(g => 
      g.id === editingGarden.id 
        ? { ...g, ...editForm }
        : g
    ));

    toast.success('Garden updated successfully!');
    setEditDialogOpen(false);
    setEditingGarden(null);
  };

  const handleDeleteGarden = (gardenId: string) => {
    setDeletingGardenId(gardenId);
    setDeleteAlertOpen(true);
  };

  const confirmDeleteGarden = () => {
    if (!deletingGardenId) return;

    setMyGardens(prev => prev.filter(g => g.id !== deletingGardenId));
    toast.success('Garden deleted successfully');
    setDeleteAlertOpen(false);
    setDeletingGardenId(null);
  };

  // User Management Functions
  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setEditUserDialogOpen(true);
  };

  const handleSaveUser = (role: UserRole) => {
    if (!editingUser) return;

    setUsers(prev => prev.map(u => 
      u.id === editingUser.id 
        ? { ...u, role }
        : u
    ));

    toast.success('User role updated successfully!');
    setEditUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setDeletingUserId(userId);
    setDeleteUserAlertOpen(true);
  };

  const confirmDeleteUser = () => {
    if (!deletingUserId) return;

    setUsers(prev => prev.filter(u => u.id !== deletingUserId));
    toast.success('User deleted successfully');
    setDeleteUserAlertOpen(false);
    setDeletingUserId(null);
  };

  const handleShowQR = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setQrDialogOpen(true);
  };

  const handleViewDetails = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setDetailsDialogOpen(true);
  };

  const getBookingQRData = (booking: typeof mockBookings[0]) => {
    return JSON.stringify({
      bookingId: booking.id,
      garden: booking.gardenName,
      date: booking.date,
      time: `${booking.startTime} - ${booking.endTime}`,
      guests: booking.guests,
      status: booking.status,
      totalPrice: `$${booking.totalPrice}`,
      userName: booking.userName,
    });
  };

  const handleOpenClaimDialog = (booking: typeof mockBookings[0]) => {
    setSelectedBooking(booking);
    setClaimForm({
      title: '',
      description: '',
      category: 'service_issue',
    });
    setClaimDialogOpen(true);
  };

  const handleSubmitClaim = () => {
    if (!selectedBooking || !claimForm.title || !claimForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newClaim: Claim = {
      id: `c${claims.length + 1}`,
      bookingId: selectedBooking.id,
      gardenName: selectedBooking.gardenName,
      userId: user!.id,
      userName: user!.name,
      userEmail: user!.email,
      title: claimForm.title,
      description: claimForm.description,
      category: claimForm.category,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setClaims([...claims, newClaim]);
    toast.success('Claim submitted successfully', {
      description: 'An admin will review your claim shortly.'
    });
    setClaimDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setAdminNotes(claim.adminNotes || '');
    setAdminClaimDialogOpen(true);
  };

  const handleUpdateClaimStatus = (status: Claim['status']) => {
    if (!selectedClaim) return;

    setClaims(prev => prev.map(c => 
      c.id === selectedClaim.id 
        ? { 
            ...c, 
            status, 
            resolvedAt: status === 'resolved' || status === 'rejected' ? new Date().toISOString() : c.resolvedAt,
            adminNotes 
          }
        : c
    ));

    toast.success(`Claim ${status === 'resolved' ? 'resolved' : status === 'rejected' ? 'rejected' : 'updated'} successfully`);
    setAdminClaimDialogOpen(false);
    setSelectedClaim(null);
  };

  const getClaimStatusVariant = (status: Claim['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'resolved':
        return 'default';
      case 'under_review':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getClaimStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
     
      <div className="container mx-auto px-4 py-8">
        {/* User Info Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground capitalize">{user.role} Account</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-semibold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            {user.role === 'owner' && (
              <TabsTrigger value="gardens">My Gardens</TabsTrigger>
            )}
            {user.role === 'admin' && (
              <TabsTrigger value="admin">Admin Panel</TabsTrigger>
            )}
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {userBookings.length > 0 ? (
              userBookings.map((booking) => (
                <Card key={booking.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{booking.gardenName}</h3>
                        <Badge variant={getStatusVariant(booking.status)} className="gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                        <p>Time: {booking.startTime} - {booking.endTime}</p>
                        <p>Guests: {booking.guests}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${booking.totalPrice}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" onClick={() => handleViewDetails(booking)}>View Details</Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleShowQR(booking)}
                          title="View QR Code"
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleOpenClaimDialog(booking)}
                          title="File a Claim"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring beautiful gardens and make your first booking
                </p>
                <Button>Browse Gardens</Button>
              </Card>
            )}
          </TabsContent>

          {/* Gardens Tab */}
          {user.role === 'owner' && (
            <TabsContent value="gardens" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Listed Gardens</h2>
                <Button onClick={() => router.push('/list-garden')}>Add New Garden</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {myGardens.map((garden) => (
                  <Card key={garden.id} className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{garden.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{garden.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">${garden.price}/hr</span>
                          <Badge>Active</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleEditGarden(garden)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => router.push(`/garden/${garden.id}`)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteGarden(garden.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          )}

          {/* Admin Tab */}
          {user.role === 'admin' && (
            <TabsContent value="admin" className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Pending Verifications</h3>
                  <p className="text-3xl font-bold text-secondary">{pendingGardens.length}</p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Total Bookings</h3>
                  <p className="text-3xl font-bold text-primary">{mockBookings.length}</p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Total Users</h3>
                  <p className="text-3xl font-bold text-accent">{users.length}</p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Active Claims</h3>
                  <p className="text-3xl font-bold text-warning">{claims.filter(c => c.status === 'pending' || c.status === 'under_review').length}</p>
                </Card>
              </div>

              <Tabs defaultValue="verifications" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="bookings">All Bookings</TabsTrigger>
                  <TabsTrigger value="claims">Claims Management</TabsTrigger>
                </TabsList>

                {/* Pending Garden Verifications Tab */}
                <TabsContent value="verifications" className="space-y-4">
                  {pendingGardens.length > 0 ? (
                    pendingGardens.map((garden) => (
                      <Card key={garden.id} className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-48 h-32 rounded-lg bg-muted flex-shrink-0" />
                          
                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="font-semibold text-lg">{garden.name}</h4>
                              <p className="text-sm text-muted-foreground">{garden.location}</p>
                            </div>
                            
                            <p className="text-sm line-clamp-2">{garden.description}</p>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span><strong>Price:</strong> ${garden.price}/hr</span>
                              <span><strong>Capacity:</strong> {garden.capacity} guests</span>
                              <span><strong>Size:</strong> {garden.size} sqft</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                  {garden.ownerAvatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">Hosted by {garden.ownerName}</span>
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2 md:justify-center">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleVerifyGarden(garden.id)}
                              className="flex-1 md:flex-none gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleRejectGarden(garden.id)}
                              className="flex-1 md:flex-none gap-1"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-12 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                      <p className="text-muted-foreground">
                        No pending garden listings to review
                      </p>
                    </Card>
                  )}
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="space-y-4">
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-semibold">User</th>
                            <th className="text-left p-4 font-semibold">Email</th>
                            <th className="text-left p-4 font-semibold">Role</th>
                            <th className="text-right p-4 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u) => (
                            <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                      {u.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">{u.name}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Mail className="h-4 w-4" />
                                  {u.email}
                                </div>
                              </td>
                              <td className="p-4">
                                <Badge 
                                  variant={u.role === 'admin' ? 'default' : u.role === 'owner' ? 'secondary' : 'outline'}
                                  className="capitalize gap-1"
                                >
                                  {u.role === 'admin' && <Shield className="h-3 w-3" />}
                                  {u.role}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex gap-2 justify-end">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleEditUser(u)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteUser(u.id)}
                                    disabled={u.id === user?.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </TabsContent>

                {/* All Bookings Tab */}
                <TabsContent value="bookings" className="space-y-4">
                  <div className="space-y-4">
                    {mockBookings.map((booking) => (
                      <Card key={booking.id} className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{booking.gardenName}</h3>
                              <Badge variant={getStatusVariant(booking.status)} className="gap-1">
                                {getStatusIcon(booking.status)}
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
                              <p>Time: {booking.startTime} - {booking.endTime}</p>
                              <p>Guests: {booking.guests}</p>
                              <p>User ID: {booking.userId}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <p className="text-2xl font-bold">${booking.totalPrice}</p>
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toast.success('Booking details viewed')}
                              >
                                View Details
                              </Button>
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="default" 
                                    size="sm"
                                    onClick={() => toast.success('Booking confirmed')}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => toast.error('Booking cancelled')}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Claims Management Tab */}
                <TabsContent value="claims" className="space-y-4">
                  <div className="space-y-4">
                    {claims.length > 0 ? (
                      claims.map((claim) => (
                        <Card key={claim.id} className="p-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-5 w-5 text-muted-foreground" />
                                  <h3 className="font-semibold text-lg">{claim.title}</h3>
                                </div>
                                <Badge variant={getClaimStatusVariant(claim.status)} className="gap-1">
                                  {getClaimStatusIcon(claim.status)}
                                  {claim.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewClaim(claim)}
                              >
                                Review Claim
                              </Button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Garden</p>
                                <p className="font-medium">{claim.gardenName}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Category</p>
                                <p className="font-medium capitalize">{claim.category.replace('_', ' ')}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Submitted by</p>
                                <p className="font-medium">{claim.userName}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Date</p>
                                <p className="font-medium">{new Date(claim.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Description</p>
                              <p className="text-sm">{claim.description}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <Card className="p-12 text-center">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No claims yet</h3>
                        <p className="text-muted-foreground">
                          All dispute claims will appear here
                        </p>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Edit Garden Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Garden</DialogTitle>
            <DialogDescription>
              Update your garden listing information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Garden Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-price">Price per Hour ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="edit-capacity">Capacity</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  value={editForm.capacity}
                  onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="edit-size">Size (sqft)</Label>
                <Input
                  id="edit-size"
                  type="number"
                  value={editForm.size}
                  onChange={(e) => setEditForm({ ...editForm, size: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGarden}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Garden Alert Dialog */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Garden</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this garden? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGarden} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {editingUser?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="user-role">User Role</Label>
              <Select
                defaultValue={editingUser?.role}
                onValueChange={(value) => handleSaveUser(value as UserRole)}
              >
                <SelectTrigger id="user-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visitor">Visitor</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Booking QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code to view booking details
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex justify-center p-6 bg-white dark:bg-white rounded-lg">
                <QRCode
                  value={getBookingQRData(selectedBooking)}
                  size={256}
                  level="H"
                />
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Booking ID:</strong> {selectedBooking.id}</p>
                <p><strong>Garden:</strong> {selectedBooking.gardenName}</p>
                <p><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedBooking.startTime} - {selectedBooking.endTime}</p>
                <p><strong>Guests:</strong> {selectedBooking.guests}</p>
                <p><strong>Status:</strong> <Badge variant={getStatusVariant(selectedBooking.status)}>{selectedBooking.status}</Badge></p>
                <p><strong>Total:</strong> ${selectedBooking.totalPrice}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information about your booking
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Garden Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">{selectedBooking.gardenName}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(selectedBooking.status)} className="gap-1">
                    {getStatusIcon(selectedBooking.status)}
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>

              {/* Booking Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Booking ID</p>
                  <p className="font-medium">{selectedBooking.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedBooking.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p className="font-medium">{selectedBooking.startTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p className="font-medium">{selectedBooking.endTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Number of Guests</p>
                  <p className="font-medium">{selectedBooking.guests}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="font-medium text-lg">${selectedBooking.totalPrice}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    handleShowQR(selectedBooking);
                  }}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  Show QR Code
                </Button>
                {selectedBooking.status === 'pending' && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      toast.success('Booking cancelled');
                      setDetailsDialogOpen(false);
                    }}
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Claim Dialog */}
      <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>File a Claim or Dispute</DialogTitle>
            <DialogDescription>
              Submit a claim regarding your booking. Our admin team will review and address it promptly.
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm"><strong>Booking:</strong> {selectedBooking.gardenName}</p>
                <p className="text-sm"><strong>Date:</strong> {new Date(selectedBooking.date).toLocaleDateString()}</p>
              </div>

              <div>
                <Label htmlFor="claim-category">Claim Category *</Label>
                <Select
                  value={claimForm.category}
                  onValueChange={(value) => setClaimForm({ ...claimForm, category: value as Claim['category'] })}
                >
                  <SelectTrigger id="claim-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">Refund Request</SelectItem>
                    <SelectItem value="property_damage">Property Damage</SelectItem>
                    <SelectItem value="cancellation">Cancellation Issue</SelectItem>
                    <SelectItem value="service_issue">Service Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="claim-title">Claim Title *</Label>
                <Input
                  id="claim-title"
                  placeholder="Brief summary of the issue"
                  value={claimForm.title}
                  onChange={(e) => setClaimForm({ ...claimForm, title: e.target.value })}
                  maxLength={100}
                />
              </div>

              <div>
                <Label htmlFor="claim-description">Description *</Label>
                <Textarea
                  id="claim-description"
                  placeholder="Provide detailed information about your claim..."
                  value={claimForm.description}
                  onChange={(e) => setClaimForm({ ...claimForm, description: e.target.value })}
                  rows={5}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {claimForm.description.length}/1000 characters
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setClaimDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitClaim}>
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Claim Review Dialog */}
      <Dialog open={adminClaimDialogOpen} onOpenChange={setAdminClaimDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Claim</DialogTitle>
            <DialogDescription>
              Review and manage this dispute claim
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{selectedClaim.title}</h3>
                  <Badge variant={getClaimStatusVariant(selectedClaim.status)} className="gap-1">
                    {getClaimStatusIcon(selectedClaim.status)}
                    {selectedClaim.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Garden</p>
                    <p className="font-medium">{selectedClaim.gardenName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium capitalize">{selectedClaim.category.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User</p>
                    <p className="font-medium">{selectedClaim.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedClaim.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">{new Date(selectedClaim.createdAt).toLocaleString()}</p>
                  </div>
                  {selectedClaim.resolvedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                      <p className="font-medium">{new Date(selectedClaim.resolvedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-base">Claim Description</Label>
                  <p className="mt-2 p-3 bg-muted/50 rounded-md text-sm">{selectedClaim.description}</p>
                </div>

                <div>
                  <Label htmlFor="admin-notes">Admin Notes</Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Add internal notes or resolution details..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setAdminClaimDialogOpen(false)}>
                  Close
                </Button>
                {selectedClaim.status !== 'resolved' && selectedClaim.status !== 'rejected' && (
                  <>
                    <Button 
                      variant="secondary"
                      onClick={() => handleUpdateClaimStatus('under_review')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark Under Review
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleUpdateClaimStatus('rejected')}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Claim
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => handleUpdateClaimStatus('resolved')}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Resolve Claim
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={deleteUserAlertOpen} onOpenChange={setDeleteUserAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
