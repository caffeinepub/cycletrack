import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Shield className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="font-serif font-semibold text-base text-foreground">Your Privacy Matters</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Lock className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            <strong className="text-foreground">End-to-end ownership:</strong> All your cycle data is stored on-chain within your own canister on the Internet Computer blockchain. Only you can access it.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Eye className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            <strong className="text-foreground">No third-party sharing:</strong> Your health data is never shared with, sold to, or accessible by any third parties, advertisers, or external services.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Server className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            <strong className="text-foreground">Decentralized storage:</strong> Data is stored on the Internet Computer, a decentralized blockchain network. There is no central server that can be breached or shut down.
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-emerald-500/15">
        Authentication is handled via Internet Identity — a privacy-preserving authentication system that does not track you across applications.
      </p>
    </div>
  );
}
