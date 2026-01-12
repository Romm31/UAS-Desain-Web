document.addEventListener('alpine:init', () => {
    // Theme Store
    Alpine.store('theme', {
        isDark: localStorage.getItem('theme') === 'dark',
        toggle() {
            this.isDark = !this.isDark;
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
            this.apply();
        },
        apply() {
            if (this.isDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        },
        init() {
            this.apply();
        }
    });

    // Request History Store
    Alpine.store('requests', {
        items: JSON.parse(localStorage.getItem('requests')) || [],
        add(item) {
            // Generate ID and Status
            item.id = Date.now();
            item.status = 'Menunggu';
            item.tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            
            this.items.unshift(item); // Add to top
            this.save();
            
            // Simulate status update
            this.simulateStatus(item.id);
        },
        save() {
            localStorage.setItem('requests', JSON.stringify(this.items));
        },
        simulateStatus(id) {
            setTimeout(() => {
                const item = this.items.find(i => i.id === id);
                if (item) {
                    item.status = 'Diproses';
                    this.save();
                }
            }, 5000); // 5 seconds to process

            setTimeout(() => {
                const item = this.items.find(i => i.id === id);
                if (item) {
                    item.status = 'Selesai';
                    this.save();
                }
            }, 10000); // 10 seconds to finish
        }
    });

    // Static Data Store
    Alpine.store('data', {
        programs: [
            {
                id: 1,
                title: 'Bantuan Pangan Subsidi',
                category: 'Bantuan Sosial',
                description: 'Program penyediaan paket sembako murah bersubsidi untuk keluarga pra-sejahtera di seluruh Indonesia.',
                image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 2,
                title: 'Beasiswa Indonesia Maju',
                category: 'Pendidikan',
                description: 'Dukungan biaya pendidikan penuh bagi siswa berprestasi dari keluarga kurang mampu.',
                image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 3,
                title: 'Modal UMKM Bangkit',
                category: 'UMKM',
                description: 'Bantuan modal usaha dan pendampingan bisnis untuk pelaku UMKM yang terdampak krisis.',
                image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 4,
                title: 'Layanan Kesehatan Gratis',
                category: 'Kesehatan',
                description: 'Akses layanan kesehatan dasar dan obat-obatan gratis di puskesmas terdaftar.',
                image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 5,
                title: 'Pelatihan Digital',
                category: 'Pendidikan',
                description: 'Pelatihan keterampilan digital untuk pemuda agar siap kerja di era industri 4.0.',
                image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 6,
                title: 'Renovasi Rumah Layak',
                category: 'Bantuan Sosial',
                description: 'Bantuan renovasi rumah tidak layak huni menjadi hunian yang sehat dan aman.',
                image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
            }
        ],
        categories: ['Semua', 'Bantuan Sosial', 'Pendidikan', 'UMKM', 'Kesehatan']
    });

    Alpine.data('programFilter', () => ({
        selectedCategory: 'Semua',
        get filteredPrograms() {
            if (this.selectedCategory === 'Semua') {
                return this.$store.data.programs;
            }
            return this.$store.data.programs.filter(p => p.category === this.selectedCategory);
        }
    }));

    Alpine.data('serviceForm', () => ({
        formData: {
            nama: '',
            nik: '',
            jenis: '',
            deskripsi: ''
        },
        loading: false,
        
        // Dynamic Validation
        get isNameValid() { return this.formData.nama.length > 2; },
        get isNikValid() { return /^\d{16}$/.test(this.formData.nik); },
        get isTypeValid() { return this.formData.jenis !== ''; },
        get isDescValid() { return this.formData.deskripsi.length > 10; },
        get isValid() { return this.isNameValid && this.isNikValid && this.isTypeValid && this.isDescValid; },
        
        submitForm() {
            if(!this.isValid) return;

            this.loading = true;

            // Simulasi submit processing
            setTimeout(() => {
                this.loading = false;
                
                // Add to Global Store
                Alpine.store('requests').add({...this.formData});
                
                // Show Success Toast
                const toastEl = document.getElementById('successToast');
                const toast = new bootstrap.Toast(toastEl);
                toast.show();

                // Reset Form
                this.formData = { nama: '', nik: '', jenis: '', deskripsi: '' };
            }, 1000);
        }
    }));

    Alpine.data('requestHistory', () => ({
        search: '',
        statusFilter: 'Semua',
        detailItem: null,

        get filteredHistory() {
            let items = this.$store.requests.items;
            
            if (this.statusFilter !== 'Semua') {
                items = items.filter(i => i.status === this.statusFilter);
            }
            
            if (this.search) {
                const lower = this.search.toLowerCase();
                items = items.filter(i => 
                    i.nama.toLowerCase().includes(lower) || 
                    i.jenis.toLowerCase().includes(lower)
                );
            }
            
            return items;
        },

        showDetail(item) {
            this.detailItem = item;
            const modal = new bootstrap.Modal(document.getElementById('detailModal'));
            modal.show();
        }
    }));
});
