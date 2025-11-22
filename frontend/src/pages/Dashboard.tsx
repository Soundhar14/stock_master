import  { useState } from 'react';
import { Package, Truck, Clock, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

export default function OperationsDashboard() {
  const [receiptData] = useState({
    toReceive: 4,
    late: 1,
    waiting:0,
    operations: 6
  });

  const [deliveryData] = useState({
    toDeliver: 4,
    late: 1,
    waiting: 2,
    operations: 6
  });

  return (
    <div className="min-h-screen">


      <div className=" ">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-2 mb-9">
          <div className="bg-white rounded-xl p-5 border border-gray-200 h  transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 h  transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Operations</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 h  transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Late Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 h  transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waiting</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Receipt Card */}
          <div className="bg-white rounded-2xl     border border-gray-200 overflow-hidden    transition-all duration-300">
            {/* Card Header */}
            <div className="bg-blue-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Receipt</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Incoming Operations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 h-full flex flex-col ">
              {/* Action Button */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-5 px-6 rounded-xl transition-all duration-200 shadow-lg    transform hover:-translate-y-0.5 mb-6 group">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{receiptData.toReceive} to receive</span>
                  <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Status Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-linear-to-r from-orange-50 to-orange-100/50 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Late</p>
                        <p className="text-xs text-gray-500 mt-0.5">Requires attention</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-orange-600">{receiptData.late}</span>
                  </div>
                </div>
  <div className="bg-linear-to-r from-yellow-50 to-yellow-100/50 rounded-xl p-5 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Waiting</p>
                        <p className="text-xs text-gray-500 mt-0.5">In queue</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-yellow-600">{receiptData.waiting}</span>
                  </div>
                </div>
                <div className="bg-linear-to-r from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Operations</p>
                        <p className="text-xs text-gray-500 mt-0.5">Total completed</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-blue-600">{receiptData.operations}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pt-6 border-t flex-end border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Completion Rate</span>
                  <span className="text-gray-900 font-semibold">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-white rounded-2xl     border border-gray-200 overflow-hidden    transition-all duration-300">
            {/* Card Header */}
            <div className="bg-blue-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Delivery</h2>
                    <p className="text-blue-100 text-sm mt-0.5">Outgoing Operations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              {/* Action Button */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-5 px-6 rounded-xl transition-all duration-200 shadow-lg    transform hover:-translate-y-0.5 mb-6 group">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{deliveryData.toDeliver} to Deliver</span>
                  <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Status Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-linear-to-r from-orange-50 to-orange-100/50 rounded-xl p-5 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Late</p>
                        <p className="text-xs text-gray-500 mt-0.5">Requires attention</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-orange-600">{deliveryData.late}</span>
                  </div>
                </div>

                <div className="bg-linear-to-r from-yellow-50 to-yellow-100/50 rounded-xl p-5 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-500 p-2 rounded-lg">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Waiting</p>
                        <p className="text-xs text-gray-500 mt-0.5">In queue</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-yellow-600">{deliveryData.waiting}</span>
                  </div>
                </div>

                <div className="bg-linear-to-r from-blue-50 to-blue-100/50 rounded-xl p-5 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Operations</p>
                        <p className="text-xs text-gray-500 mt-0.5">Total completed</p>
                      </div>
                    </div>
                    <span className="text-3xl font-bold text-blue-600">{deliveryData.operations}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600 font-medium">Completion Rate</span>
                  <span className="text-gray-900 font-semibold">67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-linear-to-r from-blue-600 to-blue-700 h-2.5 rounded-full" style={{width: '67%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

  
      </div>
    </div>
  );
}