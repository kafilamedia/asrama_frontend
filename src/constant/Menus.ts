
import { AuthorityType } from '../models/AuthorityType';
import Menu from '../models/settings/Menu';
 

export const getMenus = () => {
    let menuSet: Menu[] = [];
    for (let i = 0; i < _menus.length; i++) {
        const element: Menu = _menus[i];
        const menu:Menu = Object.assign(new Menu, element);
        const subMenus:Menu[] = [];
        if (element.subMenus) {
            for (let i = 0; i < element.subMenus.length; i++) {
                const subMenu = element.subMenus[i];
                subMenus.push(Object.assign(new Menu, subMenu));
            }
            menu.subMenus = subMenus;
        }
        menuSet.push(menu);
    }
    
    return menuSet;
}
export const extractMenuPath = (pathName: string) => {
    const pathRaw = pathName.split('/');
   
    let firstPath = pathRaw[0];
    if (firstPath.trim() == "") {
        firstPath = pathRaw[1];
    }
    return firstPath;
}
export const getMenuByMenuPath = (pathName: string): Menu | null => {
    const menus = getMenus();
    try {
        for (let i = 0; i < menus.length; i++) {
            const menu: Menu = menus[i];
            if (menu.url == "/" + pathName) {
                return menu;
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

const _menus: Menu[] = [
    {
        code: 'home',
        name: "Home",
        url: "/home",
        menuClass: "fa fa-home",
        active: false,
        authenticated: false,
        showSidebar: false,
        role : []
    },
    
    {
        code: 'dashboard',
        name: "Dashboard",
        url: "/dashboard",
        menuClass: "fas fa-tachometer-alt",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.admin_asrama, AuthorityType.musyrif_asrama],
        subMenus: [
            {
                code: 'followup',
                name: 'Follow Up',
                url: 'followup',
                menuClass: 'fas fa-history',
                role: [ AuthorityType.musyrif_asrama],
            },
            // {
            //     code: 'dashboard_productsales',
            //     name: 'Product Sales',
            //     url: 'productsales',
            //     menuClass: 'fas fa-chart-line',
            //     role: [],
            // }
        ]
    }, 
    {
        code: 'management',
        name: "Manajemen",
        url: "/management",
        menuClass: "fas fa-mail-bulk",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [AuthorityType.admin_asrama, AuthorityType.musyrif_asrama],
        subMenus: [
            {
                code: 'musyrifmanagement',
                name: 'Musyrif',
                url: 'musyrifmanagement',
                menuClass: 'fas fa-users',
                role: [AuthorityType.admin_asrama],
            },
            {
                code: 'rule_category',
                name: 'Kategori Pelanggaran',
                url: 'rule_category',
                menuClass: 'fas fa-tags',
                role: [AuthorityType.admin_asrama],
            },
            {
                code: 'rule_point',
                name: 'Poin Pelanggaran',
                url: 'rule_point',
                menuClass: 'fas fa-puzzle-piece',
                role: [AuthorityType.admin_asrama],
            }, 
            {
                code: 'warning_action',
                name: 'Peringatan',
                url: 'warning_action',
                menuClass: 'fas fa-exclamation-triangle',
                role: [AuthorityType.admin_asrama, AuthorityType.musyrif_asrama],
            }, 
            {
                code: 'category_predicate',
                name: 'Predikat Rapor',
                url: 'category_predicate',
                menuClass: 'far fa-flag',
                role: [AuthorityType.admin_asrama, ],
            }, 
            {
                code: 'rule_violation',
                name: 'Pelanggaran Umum',
                url: 'rule_violation',
                menuClass: 'fas fa-times-circle',
                role: [AuthorityType.musyrif_asrama, ],
            }, 
        ]
    }, 
    {
        code: 'asrama',
        name: "Asrama",
        url: "/asrama",
        menuClass: "fas fa-school",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [  AuthorityType.musyrif_asrama, AuthorityType.admin_asrama],
        subMenus: [
            {
                code: 'studentlist',
                name: 'Siswa',
                url: 'studentlist',
                menuClass: 'fas fa-users',
                role: [ AuthorityType.musyrif_asrama],
            },
            {
                code: 'input_point',
                name: 'Form Pelanggaran Tipe 1',
                url: 'inputpoint',
                menuClass: 'fas fa-edit',
                role: [ AuthorityType.musyrif_asrama],
            }, 
            {
                code: 'pointrecordedit',
                name: 'Form Pelanggaran Tipe 2',
                url: 'pointrecordedit',
                menuClass: 'fas fa-edit',
                role: [ AuthorityType.musyrif_asrama],
            },
            // {
            //     code: 'medicalrecord',
            //     name: 'Medical Record',
            //     url: 'medicalrecord',
            //     menuClass: 'fas fa-briefcase-medical',
            //     role: [ AuthorityType.musyrif_asrama],
            // },
            {
                code: 'pointsummary',
                name: 'Rekap Pelanggaran',
                url: 'pointsummary',
                menuClass: 'fas fa-clipboard',
                role: [ AuthorityType.musyrif_asrama, AuthorityType.admin_asrama],
            },
           
            
        ]
    }, 
    {
        code: 'report',
        name: "Laporan",
        url: "/report",
        menuClass: "fas fa-file",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [  AuthorityType.musyrif_asrama, AuthorityType.admin_asrama],
        subMenus: [
            {
                code: 'studentreport',
                name: 'Rapor',
                url: 'studentreport',
                menuClass: 'fas fa-file',
                role: [ AuthorityType.musyrif_asrama, AuthorityType.admin_asrama],
            },
        ]
    },
    {
        code: 'settings',
        name: "Setting",
        url: "/settings",
        menuClass: "fas fa-cogs",
        active: false,
        authenticated: true,
        showSidebar: true,
        role: [  AuthorityType.admin_asrama],
        subMenus: [
            {
                code: 'config',
                name: 'Konfigurasi',
                url: 'config',
                menuClass: 'fas fa-cog',
                role: [ AuthorityType.admin_asrama],
            },
        ]
    }
    
];
