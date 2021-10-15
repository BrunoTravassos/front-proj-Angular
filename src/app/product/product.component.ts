import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  prodName: string = '';
  prodPrice: string = '';
  products: Product[] = [];
  prodEdit: Product = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(
    private productService: ProductService,
    private snackbar: MatSnackBar
  ) { }


  ngOnInit() {
    this.productService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((prods) => this.products = prods)
  }

  /**salvando
   *
   */
  save() {
    if (this.prodEdit) {
      
      this.productService.update(
        // { name: this.prodName, _id: this.prodEdit._id }
        { name: this.prodName, price: this.prodPrice, _id: this.prodEdit._id }
        // { price: this.prodPrice, _id: this.prodEdit._id }
      ).subscribe(
        (prod) => {
          this.notify('UPDATED!')
        },
        (err) => {
          this.notify('ERROR');
          console.error(err);
        }
      )
    }
    else {
      this.productService.add({ name: this.prodName, price: this.prodPrice })
        .subscribe(
          (prod) => {
            console.log(prod);
            this.notify('INSERTED!');
          },
          (err) => {
            console.error(err);
          }
        )
    }

    this.clearFields();
  }

  /**
    * editar
   * @param dep
   */
  edit(prod: Product) {
    this.prodName = prod.name;
    this.prodPrice = prod.price;
    this.prodEdit = prod;
  }

  /**
   *deletar
   * @param dep
   */
  delete(prod: Product) {
    this.productService.del(prod)
      .subscribe(
        () => this.notify('REMOVED!'),
        (err) => this.notify(err.error.msg)
      )
  }


  /**
   * limparCampos
   */
  clearFields() {
    this.prodName = '';
    this.prodPrice = '';
    this.prodEdit = null;
  }

  /**
   * cancelar
   */
  cancel() {
    this.clearFields();
  }


  /**
   *Mensagem
   * @param msg
   */
  notify(msg: string) {
    this.snackbar.open(msg, 'OK', { duration: 3000 });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

}
