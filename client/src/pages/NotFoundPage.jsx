import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center p-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        
        <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
        
        <p className="text-sm text-slate-400">
          The page or module route you are looking for does not exist or has not been unlocked yet.
        </p>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Return to Overview
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default NotFoundPage;
