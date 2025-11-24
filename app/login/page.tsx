import { LoginForm } from "@/components/login-form"
import { QrCode, Shield, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative">
      {/* Bouton retour à l'accueil */}
      <Link href="/" className="absolute top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all hover:bg-[#FF6A33] hover:text-white hover:border-[#FF6A33]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </Link>
      {/* Left side - Enhanced Branding with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-[#FF6A33]/30 animate-float" />
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-[#FF6A33]/40 animate-float-delayed" />
        <div className="absolute bottom-32 left-16 w-4 h-4 rounded-full bg-[#FF6A33]/20 animate-float" />
        <div className="absolute bottom-20 right-32 w-2.5 h-2.5 rounded-full bg-[#FF6A33]/35 animate-float-delayed" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FF6A33]/5 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-gradient-to-br from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] rounded-xl shadow-lg">
              <QrCode className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">EventMaster</span>
          </Link>
          
          {/* Mini titre */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6A33]/10 dark:bg-[#FF6A33]/20 border border-[#FF6A33]/20 rounded-full text-sm font-medium text-[#FF6A33] mb-6 w-fit">
            <Shield className="w-4 h-4" />
            <span>Connexion sécurisée • Accédez à votre tableau de bord en 2 secondes</span>
          </div>
          
          <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Nous créons des{" "}
            <span className="bg-gradient-to-r from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] bg-clip-text text-transparent">solutions</span> pour votre événement
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-lg leading-relaxed">
            Gérez vos événements professionnels avec nos QR codes intelligents et notre plateforme de gestion complète propulsée par l'IA.
          </p>
          
          <div className="relative w-full max-w-md mx-auto">
            <Image
              src="/professional-person-sitting-comfortably-on-orange-.jpg"
              alt="Professional using EventMaster"
              width={500}
              height={400}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Right side - Enhanced Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-10 md:p-12">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#FF6A33] via-[#FF7033] to-[#FF8A3D] rounded-lg shadow-md">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EventMaster</span>
            </Link>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
