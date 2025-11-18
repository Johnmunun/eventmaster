import { LoginForm } from "@/components/login-form"
import { QrCode } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-accent">
      {/* Left side - Enhanced Branding with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-card relative overflow-hidden">
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-primary/30 animate-float" />
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-primary/40 animate-float-delayed" />
        <div className="absolute bottom-32 left-16 w-4 h-4 rounded-full bg-primary/20 animate-float" />
        <div className="absolute bottom-20 right-32 w-2.5 h-2.5 rounded-full bg-primary/35 animate-float-delayed" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-primary rounded-xl shadow-lg">
              <QrCode className="h-7 w-7 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">EventMaster</span>
          </Link>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">
            Nous créons des{" "}
            <span className="text-primary">solutions</span> pour votre événement
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-lg leading-relaxed">
            Gérez vos événements professionnels avec nos QR codes intelligents et notre plateforme de gestion complète propulsée par l'IA.
          </p>
          
          <div className="relative w-full max-w-md mx-auto">
            <Image
              src="/professional-person-sitting-comfortably-on-orange-.jpg"
              alt="Professional using EventMaster"
              width={500}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 md:p-10">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <QrCode className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EventMaster</span>
            </Link>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
