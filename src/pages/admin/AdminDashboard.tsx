import { useEffect, useState } from 'react';
import { useData } from '../../lib/DataContext';
import { Users, FileText, MessageCircle, TrendingUp, CheckCircle, Award } from 'lucide-react';

export default function AdminDashboard() {
  const { fetchAdminStats } = useData();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load admin stats:', error);
        setLoading(false);
      });
  }, [fetchAdminStats]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading dashboard...</div>;

  const bgGradient = 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)';
  const cardShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)';
  
  return (
    <div className="animate-fade-in" style={{ padding: '1rem', background: bgGradient, minHeight: '100%', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>Dashboard Overview</h1>
      </div>
      
      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Total Users */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: cardShadow, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#64748b' }}>
            <Users size={20} color="#3b82f6" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Total Users</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{stats?.totalUsers || 0}</div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} /> +12.5% <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last month</span>
          </div>
        </div>

        {/* Total Comments */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: cardShadow, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#64748b' }}>
            <MessageCircle size={20} color="#8b5cf6" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Total Comments</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{stats?.totalComments || 0}</div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} /> +8.2% <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last month</span>
          </div>
        </div>

        {/* Total Posts */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: cardShadow, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#64748b' }}>
            <FileText size={20} color="#f59e0b" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Total Posts</span>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{stats?.totalPosts || 0}</div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={16} /> +24% <span style={{ color: '#94a3b8', fontWeight: 400 }}>from last month</span>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Active Users Chart (Left) */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: cardShadow, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Active Users</h2>
            <select style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, color: '#475569', outline: 'none' }}>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>
          
          <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '1rem', position: 'relative' }}>
            {/* Y-axis labels mock */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>
              <span>40k</span><span>30k</span><span>20k</span><span>10k</span><span>0</span>
            </div>
            {/* Grid lines */}
            <div style={{ position: 'absolute', left: '2rem', right: 0, top: 0, bottom: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0 }}>
              {[1,2,3,4,5].map(i => <div key={i} style={{ borderBottom: '1px dashed #e2e8f0', width: '100%' }}></div>)}
            </div>

            {/* Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', height: '100%', paddingLeft: '3rem', zIndex: 1, paddingBottom: '2rem' }}>
              {stats?.activeUsersData?.map((item: any) => {
                const heightPercentage = (item.value / 40) * 100;
                const isActive = item.month === 'Dec'; // highlight highest or current
                return (
                  <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '8%', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${heightPercentage}%`, 
                      background: isActive ? 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)' : '#e2e8f0',
                      borderRadius: '8px 8px 0 0',
                      transition: 'height 0.3s ease',
                      position: 'relative'
                    }}>
                      {isActive && (
                        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                          {item.value}k
                        </div>
                      )}
                    </div>
                    <span style={{ marginTop: '1rem', fontSize: '0.75rem', fontWeight: 600, color: isActive ? '#3b82f6' : '#94a3b8' }}>{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Popular Creators (Right) */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: cardShadow, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Popular Creators</h2>
            <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>See All</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {stats?.popularCreators?.map((creator: any) => (
              <div key={creator.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={creator.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>@{creator.username}</span>
                    <CheckCircle size={14} color="#3b82f6" fill="#eff6ff" />
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>{creator.followers_count} Followers</div>
                </div>
              </div>
            ))}
            {(!stats?.popularCreators || stats.popularCreators.length === 0) && (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No creators found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Latest Ads Campaign */}
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', boxShadow: cardShadow, border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>Latest Advertisements Campaign</h2>
            <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>Generate Report</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Mock Campaign 1 */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <TrendingUp size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>Summer Sale Promos</span>
                  <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>82% Target</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>24k Clicks</span>
                  <span>Ends in 5 days</span>
                </div>
              </div>
            </div>

            {/* Mock Campaign 2 */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <Users size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>New User Acquisition</span>
                  <span style={{ fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600 }}>45% Target</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span>Waiting Join</span>
                  <span>Ends in 12 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Achievement */}
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '2rem', borderRadius: '16px', boxShadow: cardShadow, color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-20px', top: '10px', opacity: 0.1 }}>
            <Award size={180} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>New Achievement!</h2>
          <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem', maxWidth: '80%', position: 'relative', zIndex: 1 }}>
            Congratulations because you have successfully managed the platform for 1 year. We hope you continue to grow and expand Nexus globally.
          </p>
          <button style={{ alignSelf: 'flex-start', background: 'white', color: '#2563eb', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', position: 'relative', zIndex: 1 }}>
            See Benefits
          </button>
        </div>
        
      </div>
    </div>
  );
}
